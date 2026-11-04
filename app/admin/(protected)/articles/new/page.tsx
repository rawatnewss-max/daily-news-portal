import Link from "next/link";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: locations }] = await Promise.all([
    supabase.from("categories").select("id,name").order("sort_order").order("name"),
    supabase.from("locations").select("id,name").order("name"),
  ]);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-red-50 p-3 text-red-700"><FilePlus2 size={26} /></span>
          <div>
            <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">नई खबर लिखें</h1>
            <p className="mt-1 text-sm text-slate-500">खबर तैयार करें, फोटो चुनें और ड्राफ्ट या प्रकाशित करें।</p>
          </div>
        </div>
        <Link href="/admin/articles" className="btn-secondary inline-flex min-h-11 items-center gap-2"><ArrowLeft size={17} /> सभी खबरें</Link>
      </div>
      <ArticleForm action={createArticleAction} categories={categories ?? []} locations={locations ?? []} submitLabel="खबर सेव करें" />
    </div>
  );
}
