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
  if (file.size > 5 * 1024 * 1024) throw new Error("हर फोटो 5MB से कम होनी चाहिए।");
  const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
  const ext = extensions[file.type];
  if (!ext) throw new Error("JPG, PNG, WebP या GIF फोटो ही अपलोड करें।");
  const fileName = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("news-images").upload(fileName, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("news-images").getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Every photo must be in one of the two editor slots.
 * Existing URLs are accepted only if they are already associated with this article.
 * `image_url` remains the public cover photo for backwards compatibility.
 */
async function articleImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  existingUrls: string[] = [],
) {
  const existing = new Set(existingUrls.filter(Boolean));
  const values: Array<string | null> = [null, null];

  // Check both uploads before uploading either, so obvious invalid files do not
  // leave a successful first upload orphaned.
  for (let index = 0; index < 2; index++) {
    const value = formData.get(`photo_${index}`);
    const file = value instanceof File ? value : null;
    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) throw new Error("हर फोटो 5MB से कम होनी चाहिए।");
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) throw new Error("कृपया JPG, PNG, WebP या GIF फोटो चुनें।");
    }
  }

  for (let index = 0; index < 2; index++) {
    const value = formData.get(`photo_${index}`);
    const file = value instanceof File && value.size > 0 ? value : null;
    // Legacy open forms may still send their original image field.
    const oldValue = index === 0 ? formData.get("image") : null;
    const legacyFile = oldValue instanceof File && oldValue.size > 0 ? oldValue : null;
    if (file || legacyFile) {
      values[index] = await uploadImage(supabase, file ?? legacyFile);
    } else {
      const retained = safeText(formData.get(`existing_photo_${index}`));
      if (retained && existing.has(retained)) values[index] = retained;
    }
  }

  const requestedCover = Number(safeText(formData.get("cover_index")) || "0") === 1 ? 1 : 0;
  const gallery = values.filter((url): url is string => Boolean(url));
  const cover = values[requestedCover] ?? gallery[0] ?? null;
  return { image_url: cover, image_urls: gallery };
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
  const photos = await articleImages(supabase, formData);
  const slug = `${payload.slug}-${Date.now().toString().slice(-6)}`;
  const { error } = await supabase.from("articles").insert({ ...payload, slug, ...photos, author_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles?saved=1");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = articlePayload(formData);
  const { data: existing, error: existingError } = await supabase
    .from("articles").select("slug,published_at,image_url,image_urls").eq("id", id).single();
  if (existingError || !existing) throw new Error("खबर नहीं मिली।");
  const existingUrls = Array.from(new Set([
    ...(Array.isArray(existing.image_urls) ? existing.image_urls : []),
    ...(existing.image_url ? [existing.image_url] : []),
  ]));
  const photos = await articleImages(supabase, formData, existingUrls);
  const update: Record<string, unknown> = { ...payload, ...photos, updated_at: new Date().toISOString() };
  if (payload.status === "published") {
    update.published_at = existing.published_at ?? new Date().toISOString();
  }
  const { error } = await supabase.from("articles").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/articles");
  revalidatePath(`/news/${existing.slug}`);
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
export async function createBreakingTickerAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const text = safeText(formData.get("text"));
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!text) return;

  const { error } = await supabase
    .from("breaking_ticker")
    .insert({
      text,
      sort_order: sortOrder,
      is_active: true,
    });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/breaking");
  redirect("/admin/breaking");
}

export async function toggleBreakingTickerAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = safeText(formData.get("id"));
  const isActive = safeText(formData.get("is_active")) === "true";

  if (!id) return;

  const { error } = await supabase
    .from("breaking_ticker")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/breaking");
}

export async function deleteBreakingTickerAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = safeText(formData.get("id"));

  if (!id) return;

  const { error } = await supabase
    .from("breaking_ticker")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/breaking");
}
