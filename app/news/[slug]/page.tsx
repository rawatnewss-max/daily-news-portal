import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ChevronRight } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { getArticle, getRelatedArticles } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleGallery } from "@/components/ArticleGallery";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "खबर नहीं मिली" };

  return {
    title: article.title,
    description: article.excerpt ?? article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.title,
      images: article.image_url ? [article.image_url] : [],
      type: "article",
      publishedTime: article.published_at ?? article.created_at,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.id, article.categories?.slug);
  const photos = [
    ...(article.image_url ? [article.image_url] : []),
    ...(Array.isArray(article.image_urls) ? article.image_urls : []),
  ];
  const paragraphs = article.content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8">
        <nav aria-label="आप यहां हैं" className="mx-auto mb-4 flex max-w-3xl items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-red-700">होम</Link>
          <ChevronRight size={13} aria-hidden="true" />
          {article.categories ? (
            <Link href={ "/category/" + article.categories.slug } className="truncate hover:text-red-700">
              {article.categories.name}
            </Link>
          ) : (
            <span>समाचार</span>
          )}
        </nav>

        <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="px-4 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
              {article.categories && (
                <Link href={ "/category/" + article.categories.slug } className="rounded-md bg-red-50 px-2.5 py-1.5 text-red-800 hover:bg-red-100">
                  {article.categories.name}
                </Link>
              )}
              {article.locations && (
                <Link href={ "/location/" + article.locations.slug } className="rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-600 hover:bg-slate-200">
                  {article.locations.name}
                </Link>
              )}
            </div>
            <h1 className="mt-3 text-[1.5rem] font-black leading-[1.45] tracking-tight text-slate-950 sm:text-[2.1rem] sm:leading-[1.4]">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-3 text-[0.98rem] font-medium leading-[1.8] text-slate-600 sm:text-lg">
                {article.excerpt}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
              <span className="font-bold text-slate-700">डेली न्यूज मुहामी</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} aria-hidden="true" />
                {formatHindiDate(article.published_at ?? article.created_at)}
              </span>
            </div>
          </header>

          <ArticleGallery images={photos} cover={article.image_url} title={article.title} />

          <div className="px-4 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
            <div className="news-content text-slate-800">
              {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <ShareButtons title={article.title} />
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-news-title" className="mx-auto mt-8 max-w-3xl sm:mt-10">
            <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
              <h2 id="related-news-title" className="border-l-4 border-red-700 pl-3 text-lg font-black text-slate-950 sm:text-xl">
                संबंधित खबरें
              </h2>
              <Link href="/" className="whitespace-nowrap text-xs font-bold text-red-700 hover:underline">
                और खबरें देखें
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => <NewsCard key={item.id} article={item} />)}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
