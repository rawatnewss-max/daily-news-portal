import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { updateArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: article }, { data: categories }, { data: locations }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).single(),
    supabase.from("categories").select("id,name").order("sort_order").order("name"),
    supabase.from("locations").select("id,name").order("name"),
  ]);
  if (!article) notFound();
  return <div><div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-black">खबर Edit करें</h1><p className="mt-1 text-sm text-slate-500">बदलाव Save करने के बाद वेबसाइट अपडेट हो जाएगी।</p></div><Link href="/admin/articles" className="btn-secondary">Back</Link></div><ArticleForm action={updateArticleAction.bind(null, id)} categories={categories ?? []} locations={locations ?? []} article={article} submitLabel="Update News"/></div>;
}
