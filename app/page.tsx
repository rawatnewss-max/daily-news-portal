import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/SectionTitle";
import { getHomeData, getArticlesByCategory } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ featured, latest, categories }, { articles: worldArticles }, { articles: ajmerArticles }] = await Promise.all([
    getHomeData(),
    getArticlesByCategory("world"),
    getArticlesByCategory("ajmer"),
  ]);
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
  const ajmerFeed = ajmerArticles.filter((a) => a.id !== hero?.id);
  const otherLocal = rest.filter((a) => a.categories?.slug !== "ajmer");
  const showingArchive = latestTime > 0 && Date.now() - latestTime > 7 * 86400000;

  return (
    <PublicShell>
    
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 pb-2 sm:mb-5 sm:gap-2 sm:pb-4">
          <span className="text-[12px] font-extrabold text-red-800 sm:text-sm">अजमेर • राजस्थान • स्थानीय समाचार</span>
          <span className="hidden text-xs font-medium text-slate-500 min-[380px]:block">आपकी खबर, आपकी आवाज़</span>
        </div>
        {showingArchive && (
          <div role="status" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900 sm:mb-6 sm:p-4 sm:text-sm sm:leading-6">
            इस खंड में पिछली स्थानीय खबरें दिख रही हैं। आज के ताज़ा विश्व समाचार नीचे देखें।
          </div>
        )}
        {hero ? (
          <section aria-label="मुख्य समाचार" className="grid items-stretch gap-3 lg:grid-cols-[1.65fr_1fr] lg:gap-6">
            <article className="card group overflow-hidden">
              <Link href={`/news/${hero.slug}`}>
                <div className={"relative flex flex-col justify-end overflow-hidden sm:min-h-[430px] " + (hero.image_url ? "min-h-[220px] bg-slate-950 text-white" : "min-h-[148px] bg-gradient-to-br from-red-50 via-white to-slate-100 text-slate-950")}>
                  {hero.image_url ? (
                    <>
                      <Image src={hero.image_url} alt={hero.title} fill priority quality={75} className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]" sizes="(max-width:1024px) 100vw, 66vw" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    </>
                  ) : <div aria-hidden="true" className="absolute right-4 top-4 hidden text-8xl font-black text-red-700/10 sm:block">न्यूज़</div>}
                  <div className="relative z-10 p-3.5 sm:p-7">
                    <div className={"mb-1 text-[11px] font-bold sm:mb-2 sm:text-sm " + (hero.image_url ? "text-red-200" : "text-red-800")}>{hero.categories?.name ?? "मुख्य खबर"}</div>
                    <h1 className="news-headline line-clamp-3 text-[17px] font-black leading-[1.42] sm:text-4xl sm:leading-tight">{hero.title}</h1>
                    <div className={"mt-1.5 text-[10px] sm:mt-4 sm:text-xs " + (hero.image_url ? "text-slate-200" : "text-slate-600")}>{formatHindiDate(hero.published_at ?? hero.created_at)}</div>
                  </div>
                </div>
              </Link>
            </article>
            <aside className="card hidden p-5 lg:block">
              <SectionTitle>{showingArchive ? "हाल की खबरें" : "ताज़ा खबरें"}</SectionTitle>
              <div className="latest-news-scroll max-h-[400px] divide-y overflow-y-auto pr-2">
                {rest.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="block py-3 first:pt-0">
                    <div className="text-xs font-semibold text-red-700">{item.locations?.name ?? item.categories?.name ?? "समाचार"}</div>
                    <div className="news-headline mt-1 font-bold leading-6 hover:text-red-700">{item.title}</div>
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
          <section className="news-nav-scroll -mx-3 mt-3 flex flex-nowrap items-center gap-1.5 overflow-x-auto border-y border-slate-200 bg-white px-3 py-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:gap-2 sm:rounded-xl sm:border sm:p-4" aria-label="समाचार श्रेणियां">
            <span className="mr-1 hidden shrink-0 whitespace-nowrap text-xs font-extrabold text-slate-600 sm:inline">विषय चुनें</span>
            {categories.map((category) => (
              <Link key={category.id} href={"/category/" + category.slug} className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-800 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-800 sm:bg-white sm:text-xs">{category.name}</Link>
            ))}
          </section>
        )}
        {ajmerFeed.length > 0 && (
          <section aria-labelledby="ajmer-headlines" className="mt-5 sm:mt-10">
            <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-5 sm:gap-3">
              <h2 id="ajmer-headlines" className="border-l-4 border-red-700 pl-2.5 text-[15px] font-black leading-6 text-slate-950 sm:text-2xl">
                अजमेर जिले की ताज़ा खबरें
              </h2>
              <Link href="/category/ajmer" className="shrink-0 text-[10px] font-bold text-red-700 hover:underline sm:text-xs">
                सभी अजमेर समाचार
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {ajmerFeed.slice(0, 9).map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>
        )}
        {worldArticles.length > 0 && (
          <section aria-labelledby="world-headlines" className="mt-5 sm:mt-10">
            <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-5 sm:gap-3">
              <h2 id="world-headlines" className="border-l-4 border-red-700 pl-2.5 text-[15px] font-black leading-6 text-slate-950 sm:text-2xl">
                दुनिया की बड़ी खबरें
              </h2>
              <Link href="/category/world" className="shrink-0 text-[10px] font-bold text-red-700 hover:underline sm:text-xs">
                सभी विश्व समाचार देखें
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {worldArticles.slice(0, 12).map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>
        )}
        {otherLocal.length > 0 && (
          <section className="mt-5 sm:mt-10">
            <SectionTitle>{showingArchive ? "अन्य प्रकाशित खबरें" : "लेटेस्ट न्यूज़"}</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {otherLocal.slice(0, 11).map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
