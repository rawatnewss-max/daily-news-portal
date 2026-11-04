import Link from "next/link";
import { ArrowUpRight, Eye, FilePlus2, Pencil, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { deleteArticleAction } from "@/app/admin/actions";
import { formatHindiDate } from "@/lib/utils";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { supabase } = await requireAdmin();
  const { data: articles } = await supabase
    .from("articles")
    .select("id,title,slug,status,is_breaking,is_featured,updated_at,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const params = await searchParams;
  const news = articles ?? [];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">खबर प्रबंधन</h1>
          <p className="mt-1 text-sm text-slate-500">खबरें देखें, संपादित करें या नई खबर प्रकाशित करें।</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary inline-flex min-h-12 items-center gap-2 !rounded-xl"><FilePlus2 size={18} /> नई खबर</Link>
      </div>
      {(params.saved || params.deleted) && (
        <p role="status" className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          {params.deleted ? "खबर हटा दी गई।" : "खबर सफलतापूर्वक सेव हो गई।"}
        </p>
      )}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
        <span>कुल खबरें</span><span className="rounded-full bg-red-50 px-3 py-1 text-red-800">{news.length}</span>
      </div>
      <div className="mt-4 space-y-3 md:hidden">
        {news.map((article) => (
          <article key={article.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold">
              <span className={"rounded-full px-2.5 py-1 " + (article.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800")}>{article.status === "published" ? "प्रकाशित" : "ड्राफ्ट"}</span>
              {article.is_featured && <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-800">प्रमुख</span>}
              {article.is_breaking && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-800">ब्रेकिंग</span>}
            </div>
            <h2 className="text-base font-extrabold leading-7 text-slate-950">{article.title}</h2>
            <p className="mt-2 text-xs text-slate-500">अपडेट: {formatHindiDate(article.updated_at ?? article.created_at)}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <Link href={`/admin/articles/${article.id}/edit`} className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-700 px-3 text-sm font-bold text-white"><Pencil size={15} /> संपादित करें</Link>
              {article.status === "published" && <Link href={`/news/${article.slug}`} target="_blank" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700"><Eye size={15} /> देखें</Link>}
              <details className="relative">
                <summary className="flex min-h-10 cursor-pointer list-none items-center justify-center rounded-lg border border-rose-100 px-3 text-rose-700" aria-label="खबर हटाने के विकल्प"><Trash2 size={17} /></summary>
                <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-rose-100 bg-white p-3 shadow-xl">
                  <p className="mb-2 text-xs font-semibold text-slate-700">क्या यह खबर हटानी है?</p>
                  <form action={deleteArticleAction.bind(null, article.id)}>
                    <button type="submit" className="w-full rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white">हाँ, खबर हटाएँ</button>
                  </form>
                </div>
              </details>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black text-slate-500">
            <tr><th className="px-5 py-4">खबर</th><th className="px-5 py-4">स्थिति</th><th className="px-5 py-4">अपडेट</th><th className="px-5 py-4 text-right">विकल्प</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50">
                <td className="max-w-[440px] px-5 py-4">
                  <p className="font-bold leading-6 text-slate-900">{article.title}</p>
                  <div className="mt-2 flex gap-2 text-[11px] font-bold text-red-700">{article.is_featured && <span>प्रमुख खबर</span>}{article.is_breaking && <span>ब्रेकिंग</span>}</div>
                </td>
                <td className="px-5 py-4"><span className={"rounded-full px-2.5 py-1 text-xs font-bold " + (article.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")}>{article.status === "published" ? "प्रकाशित" : "ड्राफ्ट"}</span></td>
                <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatHindiDate(article.updated_at ?? article.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {article.status === "published" && <Link href={`/news/${article.slug}`} target="_blank" aria-label="खबर देखें" className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"><ArrowUpRight size={16}/></Link>}
                    <Link href={`/admin/articles/${article.id}/edit`} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100">संपादित</Link>
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded-lg border border-rose-100 px-3 py-2 text-xs font-bold text-rose-700">हटाएँ</summary>
                      <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-rose-100 bg-white p-3 shadow-xl">
                        <p className="mb-2 text-xs font-semibold">क्या यह खबर हटानी है?</p>
                        <form action={deleteArticleAction.bind(null, article.id)}><button type="submit" className="w-full rounded-lg bg-rose-700 p-2 text-xs font-bold text-white">हाँ, खबर हटाएँ</button></form>
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!news.length && <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">अभी कोई खबर नहीं है। नई खबर लिखकर शुरुआत करें।</p>}
    </div>
  );
}
