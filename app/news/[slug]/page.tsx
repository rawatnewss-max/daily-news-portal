import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { getArticle } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleGallery } from "@/components/ArticleGallery";

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
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <article className="card overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap gap-2 text-sm font-bold text-red-700">
              {article.categories && <Link href={`/category/${article.categories.slug}`}>{article.categories.name}</Link>}
              {article.locations && <Link href={`/location/${article.locations.slug}`} className="text-slate-500">• {article.locations.name}</Link>}
            </div>
            <h1 className="mt-3 text-2xl font-black leading-[1.55] sm:text-4xl">{article.title}</h1>
            {article.excerpt && <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>}
            <div className="mt-4 border-y border-slate-100 py-3 text-sm text-slate-500">प्रकाशित: {formatHindiDate(article.published_at ?? article.created_at)}</div>
          </div>
<div className="px-5 pb-6 sm:px-8">
  <ShareButtons title={article.title} />
</div>
          <ArticleGallery
            images={Array.from(new Set([
              ...(Array.isArray(article.image_urls) ? article.image_urls : []),
              ...(article.image_url ? [article.image_url] : []),
            ]))}
            cover={article.image_url}
            title={article.title}
          />
          <div className="news-content p-5 sm:p-8">
            {article.content.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </article>
      </div>
    </PublicShell>
  );
}
