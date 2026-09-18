import { requireAdmin } from "@/lib/auth";
import { createLocationAction, deleteLocationAction } from "@/app/admin/actions";

export default async function LocationsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("locations").select("id,name,slug").order("name");
  return <div><h1 className="text-2xl font-black">Locations</h1><div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]"><form action={createLocationAction} className="card h-fit p-5"><label className="label">नई Location</label><input className="input" name="name" required placeholder="जैसे: अजमेर, पुष्कर, मुहामी"/><button className="btn-primary mt-3 w-full">Add Location</button></form><div className="card overflow-hidden"><div className="divide-y">{(data ?? []).map(l => <div key={l.id} className="flex items-center justify-between gap-4 p-4"><div><div className="font-bold">{l.name}</div><div className="text-xs text-slate-400">/{l.slug}</div></div><form action={deleteLocationAction.bind(null, l.id)}><button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Delete</button></form></div>)}</div></div></div></div>;
}
