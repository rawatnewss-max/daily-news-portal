import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/SectionTitle";
import { getArticlesByCategory } from "@/lib/data";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { category, articles } = await getArticlesByCategory(slug);
  if (!category) notFound();
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle>{category.name}</SectionTitle>
        {articles.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{articles.map((a) => <NewsCard key={a.id} article={a} />)}</div> : <div className="card p-8 text-center text-slate-500">इस श्रेणी में अभी कोई खबर नहीं है।</div>}
      </div>
    </PublicShell>
  );
}
