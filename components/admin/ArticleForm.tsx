"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Camera, CheckCircle2, FileText, ImagePlus, LoaderCircle, Save, Trash2, UploadCloud } from "lucide-react";

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
  image_urls?: string[] | null;
};

type PhotoSlot = { url: string; existing: boolean } | null;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function SubmitNews({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto">
      {pending ? <LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> : <Save size={19} aria-hidden="true" />}
      {pending ? "खबर सेव हो रही है…" : label}
    </button>
  );
}

export function ArticleForm({
  action, categories, locations, article, submitLabel = "खबर सेव करें",
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Option[];
  locations: Option[];
  article?: ArticleValue;
  submitLabel?: string;
}) {
  const existingImages = Array.from(new Set(
    [ ...(Array.isArray(article?.image_urls) ? article.image_urls : []), ...(article?.image_url ? [article.image_url] : []) ]
      .filter((url): url is string => typeof url === "string" && url.length > 0)
  )).slice(0, 2);
  const [slots, setSlots] = useState<PhotoSlot[]>(() => [
    existingImages[0] ? { url: existingImages[0], existing: true } : null,
    existingImages[1] ? { url: existingImages[1], existing: true } : null,
  ]);
  const [cover, setCover] = useState(() => Math.max(existingImages.indexOf(article?.image_url ?? ""), 0));
  const [photoError, setPhotoError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([null, null]);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function pickPhoto(index: number, file: File | undefined) {
    if (!file) return;
    if (!SUPPORTED_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      setPhotoError("केवल JPG, PNG, WebP या GIF फोटो चुनें। हर फोटो 5MB से कम होनी चाहिए।");
      if (inputs.current[index]) inputs.current[index]!.value = "";
      return;
    }
    const hadPhotos = slots.some(Boolean);
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    setSlots((current) => current.map((slot, i) => i === index ? { url, existing: false } : slot));
    if (!hadPhotos) setCover(index);
    setPhotoError("");
  }

  function removePhoto(index: number) {
    const newSlots = slots.map((slot, i) => i === index ? null : slot);
    setSlots(newSlots);
    if (inputs.current[index]) inputs.current[index]!.value = "";
    if (cover === index) setCover(newSlots.findIndex(Boolean) >= 0 ? newSlots.findIndex(Boolean) : 0);
    setPhotoError("");
  }

  const photoCount = slots.filter(Boolean).length;

  return (
    <form action={action} className="space-y-5 pb-6 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
          <span className="rounded-xl bg-red-50 p-2.5 text-red-700"><FileText size={22} /></span>
          <div>
            <h2 className="text-lg font-black text-slate-950">समाचार लिखें</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">शीर्षक स्पष्ट रखें, खबर पैराग्राफ में लिखें।</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="news-title" className="label">खबर का शीर्षक <span className="text-red-700">*</span></label>
            <input id="news-title" className="input min-h-12 text-base font-bold sm:text-lg" name="title" defaultValue={article?.title ?? ""} required placeholder="यहाँ खबर की मुख्य हेडलाइन लिखें" />
          </div>
          <div>
            <label htmlFor="news-excerpt" className="label">संक्षिप्त विवरण</label>
            <textarea id="news-excerpt" className="input min-h-28 text-base leading-7" name="excerpt" defaultValue={article?.excerpt ?? ""} placeholder="होम पेज पर दिखने वाला 1–2 पंक्तियों का विवरण" />
          </div>
          <div>
            <label htmlFor="news-content" className="label">पूरी खबर <span className="text-red-700">*</span></label>
            <textarea id="news-content" className="input min-h-[300px] resize-y text-base leading-8 sm:min-h-[390px]" name="content" defaultValue={article?.content ?? ""} required placeholder="पूरी खबर यहाँ लिखें… नए पैराग्राफ के लिए एक खाली लाइन छोड़ें।" />
          </div>
        </div>
      </div>

      <section aria-labelledby="news-photos-heading" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="rounded-xl bg-rose-50 p-2.5 text-rose-700"><Camera size={22} /></span>
          <div className="min-w-0 flex-1">
            <h2 id="news-photos-heading" className="text-lg font-black text-slate-950">फोटो और कवर चयन</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">एक खबर में अधिकतम दो फोटो लगाएँ। जिसे कवर बनाना है, उसी पर ‘कवर चुनें’ दबाएँ।</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {slots.map((slot, index) => (
            <div key={index} className={"overflow-hidden rounded-2xl border-2 transition " + (slot && cover === index ? "border-red-600 bg-red-50/40" : "border-slate-200 bg-slate-50/60")}>
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {slot ? (
                  <>
                    <img src={slot.url} alt={`फोटो ${index + 1} का प्रीव्यू`} className="h-full w-full object-contain" />
                    {cover === index && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-red-700 px-3 py-1.5 text-xs font-extrabold text-white shadow"><CheckCircle2 size={14} /> कवर फोटो</span>}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400"><ImagePlus size={38} strokeWidth={1.6} /><span className="text-sm font-bold">फोटो {index + 1} जोड़ें</span></div>
                )}
              </div>
              <div className="space-y-3 p-3 sm:p-4">
                <input type="hidden" name={`existing_photo_${index}`} value={slot?.existing ? slot.url : ""} />
                <label htmlFor={`photo-input-${index}`} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:border-red-400 hover:text-red-700">
                  <UploadCloud size={18} />
                  {slot ? "फोटो बदलें" : `फोटो ${index + 1} अपलोड करें`}
                </label>
                <input
                  ref={(el) => { inputs.current[index] = el; }}
                  id={`photo-input-${index}`}
                  className="sr-only"
                  name={`photo_${index}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => pickPhoto(index, e.target.files?.[0])}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className={"inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm font-bold " + (slot && cover === index ? "text-red-700" : "text-slate-600")}>
                    <input type="radio" name="cover_index" value={index} checked={cover === index && Boolean(slot)} disabled={!slot} onChange={() => setCover(index)} className="h-5 w-5 accent-red-700" />
                    {slot && cover === index ? "कवर चुना गया" : "कवर चुनें"}
                  </label>
                  {slot && <button type="button" onClick={() => removePhoto(index)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={15} /> हटाएँ</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">{photoCount}/2 फोटो चुनी गई हैं · प्रति फोटो अधिकतम 5MB · JPG, PNG, WebP या GIF</p>
        {photoError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{photoError}</p>}
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">चुनी हुई कवर फोटो होम पेज पर दिखेगी। पाठक पूरी खबर खोलकर नीचे दोनों फोटो में से कोई भी देख सकेंगे।</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-black">श्रेणी और क्षेत्र</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="news-category" className="label">खबर की श्रेणी</label>
              <select id="news-category" className="input min-h-12" name="category_id" defaultValue={article?.category_id ?? ""}><option value="">श्रेणी चुनें</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </div>
            <div><label htmlFor="news-location" className="label">स्थान / गाँव</label>
              <select id="news-location" className="input min-h-12" name="location_id" defaultValue={article?.location_id ?? ""}><option value="">स्थान चुनें</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-black">प्रकाशन विकल्प</h2>
          <div>
            <label htmlFor="news-status" className="label">खबर की स्थिति</label>
            <select id="news-status" className="input min-h-12" name="status" defaultValue={article?.status ?? "draft"}><option value="draft">ड्राफ्ट — अभी प्रकाशित नहीं</option><option value="published">प्रकाशित करें — वेबसाइट पर दिखाएँ</option></select>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 text-sm font-semibold"><input type="checkbox" name="is_breaking" defaultChecked={Boolean(article?.is_breaking)} className="h-5 w-5 accent-red-700" /> ब्रेकिंग न्यूज</label>
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 text-sm font-semibold"><input type="checkbox" name="is_featured" defaultChecked={Boolean(article?.is_featured)} className="h-5 w-5 accent-red-700" /> प्रमुख खबर</label>
          </div>
        </section>
      </div>

      <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <summary className="cursor-pointer text-sm font-bold text-slate-700">उन्नत सेटिंग — खबर का URL बदलें</summary>
        <div className="mt-4">
          <label htmlFor="news-slug" className="label">कस्टम URL (वैकल्पिक)</label>
          <input id="news-slug" className="input" name="slug" defaultValue={article?.slug ?? ""} placeholder="खाली छोड़ें तो शीर्षक से बन जाएगा" />
          <p className="mt-2 text-xs text-slate-500">पहले से प्रकाशित खबर का URL बदलने पर पुराने शेयर लिंक प्रभावित हो सकते हैं।</p>
        </div>
      </details>

      <div className="sticky bottom-3 z-30 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:p-4">
        <p className="hidden text-xs font-semibold text-slate-500 sm:block">अपनी खबर की जानकारी जाँचकर सेव करें।</p>
        <SubmitNews label={submitLabel} />
      </div>
    </form>
  );
}
