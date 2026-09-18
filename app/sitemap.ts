import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("articles").select("slug,updated_at").eq("status", "published").order("updated_at", { ascending: false }).limit(5000);
    return [
      { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
      ...(data ?? []).map(a => ({ url: `${base}/news/${encodeURIComponent(a.slug)}`, lastModified: new Date(a.updated_at), changeFrequency: "daily" as const, priority: .8 })),
    ];
  } catch {
    return [{ url: base, lastModified: new Date() }];
  }
}
