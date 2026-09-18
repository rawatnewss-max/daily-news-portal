import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
  const { supabase, profile } = await requireAdmin();
  const [{ count: total }, { count: published }, { count: drafts }, { count: breaking }] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_breaking", true).eq("status", "published"),
  ]);
  const stats = [["कुल खबरें", total ?? 0], ["Published", published ?? 0], ["Draft", drafts ?? 0], ["Breaking", breaking ?? 0]];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-black">Dashboard</h1><p className="mt-1 text-sm text-slate-500">नमस्कार {profile.full_name || "Admin"}</p></div><Link href="/admin/articles/new" className="btn-primary">+ नई खबर</Link></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <div key={String(label)} className="card p-5"><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-2 text-3xl font-black">{value}</div></div>)}</div>
      <div className="card mt-6 p-6"><h2 className="text-lg font-black">Quick Start</h2><p className="mt-2 text-sm leading-6 text-slate-600">नई खबर बनाने के लिए “नई खबर” दबाएँ। Draft में सेव करें या सीधे Publish करें। Breaking और Featured विकल्प भी यहीं मिलेंगे।</p></div>
    </div>
  );
}
