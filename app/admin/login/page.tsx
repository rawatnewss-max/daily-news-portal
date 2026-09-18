import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginAction } from "@/app/admin/actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "admin") redirect("/admin");
  }
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <div className="text-2xl font-black text-red-700">Daily News Portal</div>
          <h1 className="mt-2 text-xl font-bold">Admin Login</h1>
        </div>
        {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{decodeURIComponent(error)}</div>}
        <form action={loginAction} className="mt-6 space-y-4">
          <div><label className="label">Email</label><input className="input" type="email" name="email" required /></div>
          <div><label className="label">Password</label><input className="input" type="password" name="password" required /></div>
          <button className="btn-primary w-full">Login</button>
        </form>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Admin account Supabase Authentication में बनाया जाता है। Public signup इस project में नहीं दिया गया है।</p>
      </div>
    </div>
  );
}
