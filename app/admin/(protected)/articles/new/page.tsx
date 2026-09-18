import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: locations }] = await Promise.all([
    supabase.from("categories").select("id,name").order("sort_order").order("name"),
    supabase.from("locations").select("id,name").order("name"),
  ]);
  return <div><div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-black">नई खबर</h1><p className="mt-1 text-sm text-slate-500">Draft सेव करें या सीधे Publish करें।</p></div><Link href="/admin/articles" className="btn-secondary">Back</Link></div><ArticleForm action={createArticleAction} categories={categories ?? []} locations={locations ?? []}/></div>;
}
