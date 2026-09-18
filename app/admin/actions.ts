"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { makeSlug, safeText } from "@/lib/utils";

export async function loginAction(formData: FormData) {
  const email = safeText(formData.get("email"));
  const password = safeText(formData.get("password"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent("ईमेल या पासवर्ड सही नहीं है")}`);
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB");
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("news-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("news-images").getPublicUrl(fileName);
  return data.publicUrl;
}

function articlePayload(formData: FormData) {
  const title = safeText(formData.get("title"));
  const excerpt = safeText(formData.get("excerpt"));
  const content = safeText(formData.get("content"));
  const categoryId = safeText(formData.get("category_id")) || null;
  const locationId = safeText(formData.get("location_id")) || null;
  const status = safeText(formData.get("status")) === "published" ? "published" : "draft";
  const customSlug = makeSlug(safeText(formData.get("slug")) || title);
  if (!title || !content) throw new Error("Title and content are required");
  return {
    title,
    excerpt: excerpt || null,
    content,
    category_id: categoryId,
    location_id: locationId,
    status,
    slug: customSlug,
    is_breaking: formData.get("is_breaking") === "on",
    is_featured: formData.get("is_featured") === "on",
    published_at: status === "published" ? new Date().toISOString() : null,
  };
}

export async function createArticleAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const payload = articlePayload(formData);
  const file = formData.get("image") instanceof File ? (formData.get("image") as File) : null;
  const imageUrl = await uploadImage(supabase, file);
  const slug = `${payload.slug}-${Date.now().toString().slice(-6)}`;
  const { error } = await supabase.from("articles").insert({ ...payload, slug, image_url: imageUrl, author_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/articles?saved=1");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = articlePayload(formData);
  const file = formData.get("image") instanceof File ? (formData.get("image") as File) : null;
  const imageUrl = await uploadImage(supabase, file);
  const update: Record<string, unknown> = { ...payload, updated_at: new Date().toISOString() };
  if (imageUrl) update.image_url = imageUrl;
  if (payload.status === "published") {
    const { data: existing } = await supabase.from("articles").select("published_at").eq("id", id).single();
    update.published_at = existing?.published_at ?? new Date().toISOString();
  }
  const { error } = await supabase.from("articles").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/articles?saved=1");
}

export async function deleteArticleAction(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/articles?deleted=1");
}

export async function createCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = safeText(formData.get("name"));
  if (!name) return;
  const { error } = await supabase.from("categories").insert({ name, slug: makeSlug(name) });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function createLocationAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = safeText(formData.get("name"));
  if (!name) return;
  const { error } = await supabase.from("locations").insert({ name, slug: makeSlug(name) });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function deleteLocationAction(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("locations").delete().eq("id", id);
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function updateSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    id: 1,
    site_name: safeText(formData.get("site_name")) || "Daily News Portal",
    tagline: safeText(formData.get("tagline")),
    contact_phone: safeText(formData.get("contact_phone")),
    contact_email: safeText(formData.get("contact_email")),
    facebook_url: safeText(formData.get("facebook_url")),
    youtube_url: safeText(formData.get("youtube_url")),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}
