import Link from "next/link";
import { LayoutDashboard, Newspaper, Zap, Tags, MapPin, Settings, ExternalLink, LogOut, Menu, PenSquare, ChevronDown } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  ["/admin", "डैशबोर्ड", LayoutDashboard],
  ["/admin/articles", "सभी खबरें", Newspaper],
  ["/admin/breaking", "ब्रेकिंग टिकर", Zap],
  ["/admin/categories", "श्रेणियां", Tags],
  ["/admin/locations", "स्थान / गांव", MapPin],
  ["/admin/settings", "सेटिंग्स", Settings],
] as const;

function MenuLinks() {
  return (
    <>
      {links.map(([href, label, Icon]) => (
        <Link key={href} href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">
          <Icon size={19} aria-hidden="true" /> {label}
        </Link>
      ))}
      <Link href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">
        <ExternalLink size={19} aria-hidden="true" /> वेबसाइट देखें
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"><LogOut size={19} aria-hidden="true" /> लॉगआउट</button>
      </form>
    </>
  );
}

export function AdminSidebar() {
  return (
    <aside className="relative z-40 w-full shrink-0 bg-slate-950 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-[265px] lg:overflow-y-auto">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 py-3 lg:border-b lg:border-white/10 lg:px-5 lg:py-6">
        <Link href="/admin" className="flex min-w-0 items-center gap-3" aria-label="Daily News Muhami एडमिन होम">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-700 text-lg font-black text-white shadow-md">न</span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black tracking-tight text-white lg:text-lg">Daily News Muhami</span>
            <span className="mt-0.5 block text-[11px] font-semibold text-slate-400">न्यूज़ एडमिन पैनल</span>
          </span>
        </Link>
        <div className="lg:hidden">
          <details className="group">
            <summary className="flex h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-1 rounded-xl border border-white/20 px-2 text-white transition hover:bg-white/10" aria-label="एडमिन मेन्यू खोलें">
              <Menu size={21} aria-hidden="true" />
              <ChevronDown size={14} className="transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <nav aria-label="एडमिन मेन्यू" className="absolute inset-x-0 top-full z-50 grid grid-cols-2 gap-1 border-t border-white/10 bg-slate-950 p-3 shadow-2xl sm:grid-cols-3">
              <MenuLinks />
            </nav>
          </details>
        </div>
      </div>
      <div className="hidden px-3 py-6 lg:block">
        <Link href="/admin/articles/new" className="mb-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"><PenSquare size={18} aria-hidden="true" /> नई खबर लिखें</Link>
        <p className="mb-2 px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">प्रबंधन</p>
        <nav aria-label="एडमिन नेविगेशन" className="space-y-1"><MenuLinks /></nav>
      </div>
    </aside>
  );
}
