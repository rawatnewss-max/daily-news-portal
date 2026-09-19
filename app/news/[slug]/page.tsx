import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { getArticle } from "@/lib/data";
import { formatHindiDate } from "@/lib/utils";
import { ShareButtons } from "@/components/ShareButtons";

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
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{article.title}</h1>
            {article.excerpt && <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>}
            <div className="mt-4 border-y border-slate-100 py-3 text-sm text-slate-500">प्रकाशित: {formatHindiDate(article.published_at ?? article.created_at)}</div>
          </div>
          {article.image_url && (
            <div className="relative aspect-[16/9] bg-slate-100">
              <Image src={article.image_url} alt={article.title} fill priority className="object-cover" sizes="(max-width:896px) 100vw, 896px" />
            </div>
          )}
          <div className="news-content p-5 sm:p-8">
            {article.content.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
<div className="px-5 pb-6 sm:px-8">
  <ShareButtons title={article.title} />
</div>
        </article>
      </div>
    </PublicShell>
  );
}
