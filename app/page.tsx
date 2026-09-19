import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/SectionTitle";
import { getHomeData } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { featured, latest } = await getHomeData();
  const hero = featured ?? latest[0] ?? null;
  const rest = latest.filter((a) => a.id !== hero?.id);

  return (
    <PublicShell>
    
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {hero ? (
          <section className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
            <article className="card overflow-hidden">
              <Link href={`/news/${hero.slug}`}>
                <div className="relative aspect-[16/9] bg-slate-100">
                  {hero.image_url ? <Image src={hero.image_url} alt={hero.title} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" /> : <div className="flex h-full items-center justify-center text-slate-400">मुख्य खबर</div>}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-20 text-white sm:p-7">
                    <div className="mb-2 text-sm font-bold text-red-200">{hero.categories?.name ?? "मुख्य खबर"}</div>
                    <h1 className="text-2xl font-black leading-tight sm:text-4xl">{hero.title}</h1>
                    <div className="mt-3 text-xs text-slate-200">{formatHindiDate(hero.published_at ?? hero.created_at)}</div>
                  </div>
                </div>
              </Link>
            </article>
            <aside className="card p-5">
              <SectionTitle>ताज़ा खबरें</SectionTitle>
              <div className="divide-y">
                {rest.slice(0, 6).map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="block py-3 first:pt-0">
                    <div className="text-xs font-semibold text-red-700">{item.locations?.name ?? item.categories?.name ?? "समाचार"}</div>
                    <div className="mt-1 font-bold leading-6 hover:text-red-700">{item.title}</div>
                  </Link>
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <div className="card p-10 text-center">
            <h1 className="text-2xl font-black">आपका News Portal तैयार है</h1>
            <p className="mt-2 text-slate-600">Admin Panel से पहली खबर Publish करते ही यहाँ दिखाई देगी।</p>
            <Link href="/admin/login" className="btn-primary mt-5">Admin Login</Link>
          </div>
        )}

        {rest.length > 0 && (
          <section className="mt-10">
            <SectionTitle>लेटेस्ट न्यूज़</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 9).map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
