import Link from "next/link";
import { Search } from "lucide-react";
import { getCategories, getSiteSettings } from "@/lib/data";

export async function Header() {
  const [site, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  const today = new Intl.DateTimeFormat("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return (
    <>
      <div className="bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <span>{today}</span>
          <Link href="/admin/login" className="hover:text-white">Admin Login</Link>
        </div>
      </div>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <div className="text-2xl font-black tracking-tight text-red-700 sm:text-3xl">{site.site_name}</div>
            <div className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{site.tagline}</div>
          </Link>
          <form action="/search" className="hidden max-w-md flex-1 items-center gap-2 md:flex">
            <input className="input" name="q" placeholder="खबर खोजें..." />
            <button className="btn-primary" aria-label="खोजें"><Search size={18} /></button>
          </form>
        </div>
        <nav className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-4 py-3 text-sm font-bold sm:px-6 lg:px-8">
            <Link href="/" className="whitespace-nowrap text-red-700">होम</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="whitespace-nowrap hover:text-red-700">{c.name}</Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
