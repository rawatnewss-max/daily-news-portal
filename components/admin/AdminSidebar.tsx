import Link from "next/link";
import { LayoutDashboard, Newspaper, Zap, Tags, MapPin, Settings, ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/articles", "News", Newspaper],
  ["/admin/breaking", "Breaking Ticker", Zap],
  ["/admin/categories", "Categories", Tags],
  ["/admin/locations", "Locations", MapPin],
  ["/admin/settings", "Settings", Settings],
] as const;

export function AdminSidebar() {
  return (
    <aside className="w-full bg-slate-950 text-slate-200 lg:min-h-screen lg:w-64">
      <div className="border-b border-slate-800 p-5">
        <div className="text-xl font-black text-white">News Admin</div>
        <div className="mt-1 text-xs text-slate-500">Daily News Portal</div>
      </div>
      <nav className="grid grid-cols-2 gap-1 p-3 sm:grid-cols-3 lg:block">
        {links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-slate-800"><Icon size={18}/>{label}</Link>)}
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-slate-800"><ExternalLink size={18}/>View Site</Link>
        <form action={logoutAction}><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-slate-800"><LogOut size={18}/>Logout</button></form>
      </nav>
    </aside>
  );
}
