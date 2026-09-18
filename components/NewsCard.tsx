import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="card overflow-hidden">
      <Link href={`/news/${article.slug}`}>
        <div className="relative aspect-[16/9] bg-slate-100">
          {article.image_url ? (
            <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Daily News Portal</div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-red-700">
            {article.categories?.name && <span>{article.categories.name}</span>}
            {article.locations?.name && <span className="text-slate-500">• {article.locations.name}</span>}
          </div>
          <h2 className="line-clamp-2 text-lg font-extrabold leading-snug hover:text-red-700">{article.title}</h2>
          {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>}
          <div className="mt-3 text-xs text-slate-400">{formatHindiDate(article.published_at ?? article.created_at)}</div>
        </div>
      </Link>
    </article>
  );
}
