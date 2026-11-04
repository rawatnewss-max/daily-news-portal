import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/SectionTitle";
import { getHomeData } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { featured, latest, categories } = await getHomeData();
  const newest = latest[0] ?? featured;
  const latestTime = newest ? new Date(newest.published_at ?? newest.created_at).getTime() : 0;
  const closeToNewest = (date: string | null, created: string) =>
    latestTime > 0 && new Date(date ?? created).getTime() >= latestTime - 2 * 86400000;
  // Prefer a current featured story with a photo, then the latest pictured article.
  // An old featured flag must not pin a stale story to the homepage.
  const hero = (featured?.image_url && closeToNewest(featured.published_at, featured.created_at) ? featured : null)
    ?? latest.find((a) => a.image_url && closeToNewest(a.published_at, a.created_at))
    ?? newest;
  const rest = latest.filter((a) => a.id !== hero?.id);
  const showingArchive = latestTime > 0 && Date.now() - latestTime > 7 * 86400000;

  return (
    <PublicShell>
    
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <span className="text-sm font-extrabold text-red-800">अजमेर • राजस्थान • स्थानीय समाचार</span>
          <span className="text-xs font-medium text-slate-500">आपकी खबर, आपकी आवाज़</span>
        </div>
        {showingArchive && (
          <div role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
            इस समय पिछली प्रकाशित खबरें दिखाई जा रही हैं। नई खबर प्रकाशित होते ही यहाँ प्रदर्शित होगी।
          </div>
        )}
        {hero ? (
          <section aria-label="मुख्य समाचार" className="grid items-stretch gap-6 lg:grid-cols-[1.65fr_1fr]">
            <article className="card group overflow-hidden">
              <Link href={`/news/${hero.slug}`}>
                <div className={"relative flex min-h-[345px] flex-col justify-end overflow-hidden sm:min-h-[430px] " + (hero.image_url ? "bg-slate-950 text-white" : "bg-gradient-to-br from-red-50 via-white to-slate-100 text-slate-950")}>
                  {hero.image_url ? (
                    <>
                      <Image src={hero.image_url} alt={hero.title} fill priority className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width:1024px) 100vw, 66vw" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    </>
                  ) : <div aria-hidden="true" className="absolute right-4 top-4 text-8xl font-black text-red-700/10">न्यूज़</div>}
                  <div className="relative z-10 p-5 sm:p-7">
                    <div className={"mb-2 text-sm font-bold " + (hero.image_url ? "text-red-200" : "text-red-800")}>{hero.categories?.name ?? "मुख्य खबर"}</div>
                    <h1 className="text-2xl font-black leading-tight sm:text-4xl">{hero.title}</h1>
                    <div className={"mt-4 text-xs " + (hero.image_url ? "text-slate-200" : "text-slate-600")}>{formatHindiDate(hero.published_at ?? hero.created_at)}</div>
                  </div>
                </div>
              </Link>
            </article>
            <aside className="card p-5">
              <SectionTitle>{showingArchive ? "हाल की खबरें" : "ताज़ा खबरें"}</SectionTitle>
              <div className="latest-news-scroll max-h-[400px] divide-y overflow-y-auto pr-2">
                {rest.map((item) => (
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

        {categories.length > 0 && (
          <section className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4" aria-label="समाचार श्रेणियां">
            <span className="mr-2 text-xs font-extrabold text-slate-600">विषय चुनें</span>
            {categories.map((category) => (
              <Link key={category.id} href={"/category/" + category.slug} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 hover:border-red-300 hover:bg-red-50 hover:text-red-800">{category.name}</Link>
            ))}
          </section>
        )}
        {rest.length > 0 && (
          <section className="mt-10">
            <SectionTitle>{showingArchive ? "अन्य प्रकाशित खबरें" : "लेटेस्ट न्यूज़"}</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 9).map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
