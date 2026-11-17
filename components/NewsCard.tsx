import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";

export function NewsCard({ article }: { article: NewsArticle }) {
  const articleDate = article.published_at ?? article.created_at;

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/news/${article.slug}`}
        className="flex min-h-[116px] items-stretch gap-3 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-700 sm:block sm:p-0"
      >
        <div className="relative order-2 h-[94px] w-[112px] shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:order-none sm:aspect-[16/9] sm:h-auto sm:w-full sm:rounded-none">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 639px) 112px, (max-width: 1023px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-slate-100 text-center">
              <span aria-hidden="true" className="text-xl font-black text-red-700/35 sm:text-4xl">न्यूज़</span>
              <span className="mt-1 hidden text-[10px] font-bold tracking-wide text-slate-400 sm:block">DAILY NEWS MUHAMI</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-0.5 sm:block sm:p-4">
          <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] font-bold text-red-800 sm:mb-2 sm:text-xs">
            {article.categories?.name && <span className="truncate">{article.categories.name}</span>}
            {article.locations?.name && <span className="truncate text-slate-500">• {article.locations.name}</span>}
          </div>
          <h2 className="news-headline line-clamp-3 text-[15px] font-extrabold leading-[1.45] text-slate-950 transition-colors group-hover:text-red-700 sm:text-lg sm:leading-[1.55]">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="news-excerpt mt-2 hidden line-clamp-2 text-sm leading-6 text-slate-600 sm:block">
              {article.excerpt}
            </p>
          )}
          <time dateTime={articleDate} className="mt-1 block truncate text-[10px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
            {formatHindiDate(articleDate)}
          </time>
        </div>
      </Link>
    </article>
  );
}
