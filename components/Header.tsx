import Link from "next/link";
import { ChevronDown, MapPin, Menu, Search } from "lucide-react";
import { getCategories, getSiteSettings } from "@/lib/data";
import { VisitorCounter } from "@/components/VisitorCounter";

export async function Header() {
  const [site, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  const today = new Intl.DateTimeFormat("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-950 text-slate-200">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <span className="truncate text-[11px] font-semibold sm:text-xs">{today}</span>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <VisitorCounter />
            <Link href="/admin/login" className="whitespace-nowrap border-l border-slate-700 pl-3 text-[11px] font-semibold text-slate-200 transition hover:text-white sm:pl-5 sm:text-xs">
              एडमिन लॉगिन
            </Link>
          </div>
        </div>
      </div>

      <header className="relative z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-5 sm:py-7">
            <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Daily News Muhami होम">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-700 text-xl font-black text-white shadow-md shadow-red-900/15 sm:h-14 sm:w-14 sm:text-2xl">न</span>
              <span className="min-w-0">
                <span className="block truncate text-[22px] font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-red-800 sm:text-[31px]">{site.site_name}</span>
                <span className="mt-1 block truncate text-[11px] font-medium text-slate-500 sm:text-sm">{site.tagline}</span>
              </span>
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-800 lg:flex">
              <MapPin size={15} aria-hidden="true" /> अजमेर • राजस्थान
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-slate-100 py-3 lg:py-0">
            <nav className="min-w-0 flex-1" aria-label="मुख्य नेविगेशन">
              <div className="news-nav-scroll hidden items-center gap-6 overflow-x-auto whitespace-nowrap py-4 text-sm font-extrabold lg:flex">
                <Link href="/" className="shrink-0 border-b-2 border-red-700 pb-1 text-red-800">होम</Link>
                {categories.map((c) => (
                  <Link key={c.id} href={"/category/" + c.slug} className="shrink-0 pb-1 text-slate-800 transition hover:text-red-700">{c.name}</Link>
                ))}
              </div>
              <details className="group relative lg:hidden">
                <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100">
                  <Menu size={18} aria-hidden="true" /> श्रेणियां <ChevronDown size={14} aria-hidden="true" className="transition group-open:rotate-180" />
                </summary>
                <div className="absolute left-0 top-full z-50 mt-2 max-h-[65vh] w-[min(88vw,350px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <Link href="/" className="block rounded-lg px-3 py-2.5 text-sm font-bold text-red-800 hover:bg-red-50">होम</Link>
                  {categories.map((c) => (
                    <Link key={c.id} href={"/category/" + c.slug} className="block rounded-lg px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-red-50 hover:text-red-800">{c.name}</Link>
                  ))}
                </div>
              </details>
            </nav>
            <form action="/search" role="search" className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 lg:max-w-[285px]">
              <label htmlFor="site-search" className="sr-only">खबर खोजें</label>
              <input id="site-search" name="q" type="search" placeholder="खबर खोजें..." className="w-full min-w-0 bg-transparent px-2 py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              <button type="submit" aria-label="खबर खोजें" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-700 text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
                <Search size={17} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>
    </>
  );
}
