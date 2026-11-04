"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

export function ArticleGallery({
  images,
  cover,
  title,
}: {
  images: string[];
  cover?: string | null;
  title: string;
}) {
  const photos = Array.from(new Set(images.filter(Boolean))).slice(0, 2);
  const [selected, setSelected] = useState(() => Math.max(0, photos.indexOf(cover ?? "")));
  const startX = useRef<number | null>(null);

  if (!photos.length) return null;

  const current = photos[Math.min(selected, photos.length - 1)];
  function selectNext(direction: number) {
    setSelected((value) => (value + direction + photos.length) % photos.length);
  }

  return (
    <section aria-label="खबर की तस्वीरें" className="bg-slate-50">
      <div
        className="relative aspect-[16/10] overflow-hidden bg-slate-900 sm:aspect-[16/9]"
        onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (startX.current === null || photos.length < 2) return;
          const delta = event.changedTouches[0]?.clientX - startX.current;
          if (delta !== undefined && Math.abs(delta) > 50) selectNext(delta < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <Image
          key={current}
          src={current}
          alt={`${title} — फोटो ${selected + 1}`}
          fill
          priority={selected === 0}
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-contain"
        />
        {photos.length > 1 && (
          <>
            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white"><Images size={14} /> {selected + 1}/{photos.length}</div>
            <button type="button" onClick={() => selectNext(-1)} aria-label="पिछली फोटो" className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => selectNext(1)} aria-label="अगली फोटो" className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><ChevronRight size={22} /></button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-100 bg-white p-3">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`फोटो ${index + 1} देखें`}
              aria-pressed={selected === index}
              className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${selected === index ? "border-red-700 shadow-md" : "border-slate-200 hover:border-red-300"}`}
            >
              <Image src={photo} alt={`फोटो ${index + 1} का छोटा चित्र`} fill sizes="96px" className="object-cover" />
            </button>
          ))}
          <p className="w-full text-center text-xs text-slate-500">फोटो चुनने के लिए छोटे चित्र पर दबाएँ या स्क्रीन पर स्वाइप करें।</p>
        </div>
      )}
    </section>
  );
}
