import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SquarePen } from "lucide-react";
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
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-red-50 p-3 text-red-700"><SquarePen size={26} /></span>
          <div>
            <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">खबर संपादित करें</h1>
            <p className="mt-1 text-sm text-slate-500">शीर्षक, पूरी खबर और दोनों फोटो बदल सकते हैं।</p>
          </div>
        </div>
        <Link href="/admin/articles" className="btn-secondary inline-flex min-h-11 items-center gap-2"><ArrowLeft size={17} /> सभी खबरें</Link>
      </div>
      <ArticleForm action={updateArticleAction.bind(null, id)} categories={categories ?? []} locations={locations ?? []} article={article} submitLabel="बदलाव सेव करें" />
    </div>
  );
}
