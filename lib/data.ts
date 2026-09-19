import "server-only";
import { createClient } from "@/lib/supabase/server";
import { fallbackSite } from "@/lib/site";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  status: "draft" | "published";
  is_breaking: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
  locations: { name: string; slug: string } | null;
};

const articleSelect = `
  id,title,slug,excerpt,content,image_url,status,is_breaking,is_featured,
  published_at,created_at,
  categories(name,slug),
  locations(name,slug)
`;

export async function getSiteSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    return data ? { ...fallbackSite, ...data } : fallbackSite;
  } catch {
    return fallbackSite;
  }
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id,name,slug").order("sort_order").order("name");
  return data ?? [];
}

export async function getLocations() {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("id,name,slug").order("name");
  return data ?? [];
}

export async function getHomeData() {
  const supabase = await createClient();
  const [featuredRes, latestRes, breakingRes, categoriesRes] = await Promise.all([
    supabase
      .from("articles")
      .select(articleSelect)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(1),
    supabase
      .from("articles")
      .select(articleSelect)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12),
    supabase
  .from("breaking_ticker")
  .select("id,text,sort_order,created_at")
  .eq("is_active", true)
  .order("sort_order", { ascending: true })
  .order("created_at", { ascending: false })
  .limit(20),
    supabase.from("categories").select("id,name,slug").order("sort_order").limit(6),
  ]);

  return {
    featured: (featuredRes.data?.[0] ?? null) as unknown as NewsArticle | null,
    latest: (latestRes.data ?? []) as unknown as NewsArticle[],
    breaking: breakingRes.data ?? [],
    categories: categoriesRes.data ?? [],
  };
}

export async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data ?? null) as unknown as NewsArticle | null;
}

export async function getArticlesByCategory(slug: string) {
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("id,name,slug").eq("slug", slug).single();
  if (!category) return { category: null, articles: [] as NewsArticle[] };
  const { data } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .limit(30);
  return { category, articles: (data ?? []) as unknown as NewsArticle[] };
}

export async function getArticlesByLocation(slug: string) {
  const supabase = await createClient();
  const { data: location } = await supabase.from("locations").select("id,name,slug").eq("slug", slug).single();
  if (!location) return { location: null, articles: [] as NewsArticle[] };
  const { data } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("location_id", location.id)
    .order("published_at", { ascending: false })
    .limit(30);
  return { location, articles: (data ?? []) as unknown as NewsArticle[] };
}

export async function searchArticles(q: string) {
  if (!q.trim()) return [] as NewsArticle[];
  const supabase = await createClient();
  const safe = q.replace(/[%_,()]/g, " ").trim();
  const { data } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`)
    .order("published_at", { ascending: false })
    .limit(30);
  return (data ?? []) as unknown as NewsArticle[];
}
