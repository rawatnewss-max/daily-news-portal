import { requireAdmin } from "@/lib/auth";
import { updateSettingsAction } from "@/app/admin/actions";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const { saved } = await searchParams;
  return <div><h1 className="text-2xl font-black">Site Settings</h1>{saved && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Settings Save हो गई।</div>}<form action={updateSettingsAction} className="card mt-6 max-w-3xl space-y-5 p-6"><div><label className="label">Website Name</label><input className="input" name="site_name" defaultValue={data?.site_name ?? "Daily News Portal"}/></div><div><label className="label">Tagline</label><input className="input" name="tagline" defaultValue={data?.tagline ?? "अजमेर और राजस्थान की भरोसेमंद स्थानीय खबरें"}/></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="label">Phone</label><input className="input" name="contact_phone" defaultValue={data?.contact_phone ?? ""}/></div><div><label className="label">Email</label><input className="input" type="email" name="contact_email" defaultValue={data?.contact_email ?? ""}/></div></div><div><label className="label">Facebook URL</label><input className="input" name="facebook_url" defaultValue={data?.facebook_url ?? ""}/></div><div><label className="label">YouTube URL</label><input className="input" name="youtube_url" defaultValue={data?.youtube_url ?? ""}/></div><button className="btn-primary">Save Settings</button></form></div>;
}
