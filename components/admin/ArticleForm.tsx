type Option = { id: string; name: string };
type ArticleValue = {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  category_id?: string | null;
  location_id?: string | null;
  status?: string | null;
  is_breaking?: boolean | null;
  is_featured?: boolean | null;
  image_url?: string | null;
};

export function ArticleForm({ action, categories, locations, article, submitLabel = "Save News" }: { action: (formData: FormData) => void | Promise<void>; categories: Option[]; locations: Option[]; article?: ArticleValue; submitLabel?: string }) {
  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <div className="card p-5 sm:p-6">
        <div className="grid gap-5">
          <div><label className="label">Headline *</label><input className="input text-lg font-bold" name="title" defaultValue={article?.title ?? ""} required placeholder="खबर का शीर्षक" /></div>
          <div><label className="label">Short Summary / Excerpt</label><textarea className="input min-h-24" name="excerpt" defaultValue={article?.excerpt ?? ""} placeholder="होमपेज पर दिखने वाला छोटा सारांश" /></div>
          <div><label className="label">Full News *</label><textarea className="input min-h-[360px] leading-7" name="content" defaultValue={article?.content ?? ""} required placeholder="पूरी खबर यहाँ लिखें... पैराग्राफ अलग करने के लिए एक खाली लाइन रखें।" /></div>
          <div><label className="label">Custom URL Slug (optional)</label><input className="input" name="slug" defaultValue={article?.slug ?? ""} placeholder="खाली छोड़ें तो headline से बनेगा" /></div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5"><div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Category</label><select className="input" name="category_id" defaultValue={article?.category_id ?? ""}><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="label">Location</label><select className="input" name="location_id" defaultValue={article?.location_id ?? ""}><option value="">Select</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div></div></div>
        <div className="card p-5"><label className="label">News Image (max 5MB)</label><input className="input" type="file" name="image" accept="image/*" />{article?.image_url && <p className="mt-2 text-xs text-slate-500">नई फोटो नहीं चुनेंगे तो पुरानी फोटो बनी रहेगी।</p>}</div>
      </div>
      <div className="card p-5"><div className="grid gap-4 sm:grid-cols-3"><div><label className="label">Status</label><select className="input" name="status" defaultValue={article?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></div><label className="flex items-center gap-3 pt-7 font-semibold"><input type="checkbox" name="is_breaking" defaultChecked={Boolean(article?.is_breaking)} className="h-5 w-5 accent-red-700"/> Breaking News</label><label className="flex items-center gap-3 pt-7 font-semibold"><input type="checkbox" name="is_featured" defaultChecked={Boolean(article?.is_featured)} className="h-5 w-5 accent-red-700"/> Featured News</label></div></div>
      <div className="flex justify-end"><button className="btn-primary px-8">{submitLabel}</button></div>
    </form>
  );
}
