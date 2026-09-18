import { requireAdmin } from "@/lib/auth";
import { createCategoryAction, deleteCategoryAction } from "@/app/admin/actions";

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("id,name,slug").order("sort_order").order("name");
  return <div><h1 className="text-2xl font-black">Categories</h1><div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]"><form action={createCategoryAction} className="card h-fit p-5"><label className="label">नई Category</label><input className="input" name="name" required placeholder="जैसे: अजमेर, राजनीति, शिक्षा"/><button className="btn-primary mt-3 w-full">Add Category</button></form><div className="card overflow-hidden"><div className="divide-y">{(data ?? []).map(c => <div key={c.id} className="flex items-center justify-between gap-4 p-4"><div><div className="font-bold">{c.name}</div><div className="text-xs text-slate-400">/{c.slug}</div></div><form action={deleteCategoryAction.bind(null, c.id)}><button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Delete</button></form></div>)}</div></div></div></div>;
}
