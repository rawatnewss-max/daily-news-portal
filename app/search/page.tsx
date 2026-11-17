import { PublicShell } from "@/components/PublicShell";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/SectionTitle";
import { searchArticles } from "@/lib/data";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const articles = await searchArticles(q);
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <form className="card mb-4 flex gap-2 p-3 sm:mb-8 sm:p-4" action="/search">
          <input className="input" name="q" defaultValue={q} placeholder="खबर, गांव, विषय खोजें..." />
          <button className="btn-primary">खोजें</button>
        </form>
        <SectionTitle>{q ? `“${q}” के लिए परिणाम` : "खबर खोजें"}</SectionTitle>
        {q && articles.length === 0 && <div className="card p-8 text-center text-slate-500">कोई खबर नहीं मिली।</div>}
        {articles.length > 0 && <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{articles.map((a) => <NewsCard key={a.id} article={a} />)}</div>}
      </div>
    </PublicShell>
  );
}
