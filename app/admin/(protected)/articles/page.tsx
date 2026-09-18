import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { deleteArticleAction } from "@/app/admin/actions";
import { formatHindiDate } from "@/lib/utils";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { supabase } = await requireAdmin();
  const { data: articles } = await supabase.from("articles").select("id,title,status,is_breaking,is_featured,updated_at,created_at").order("created_at", { ascending: false }).limit(100);
  const params = await searchParams;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl font-black">News Management</h1><Link href="/admin/articles/new" className="btn-primary">+ Add News</Link></div>
      {(params.saved || params.deleted) && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{params.deleted ? "खबर Delete हो गई।" : "खबर Save हो गई।"}</div>}
      <div className="card mt-6 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Flags</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y">{(articles ?? []).map((a) => <tr key={a.id}><td className="px-4 py-3 font-semibold">{a.title}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${a.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{a.status}</span></td><td className="px-4 py-3 text-xs text-slate-500">{a.is_breaking ? "Breaking " : ""}{a.is_featured ? "Featured" : ""}</td><td className="px-4 py-3 text-xs text-slate-500">{formatHindiDate(a.updated_at ?? a.created_at)}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><Link className="btn-secondary !px-3 !py-1.5 text-xs" href={`/admin/articles/${a.id}/edit`}>Edit</Link><form action={deleteArticleAction.bind(null, a.id)}><button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">Delete</button></form></div></td></tr>)}{!articles?.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">अभी कोई खबर नहीं है।</td></tr>}</tbody></table></div></div>
    </div>
  );
}
