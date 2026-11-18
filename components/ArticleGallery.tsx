"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Info } from "lucide-react";

export function ArticleGallery({
  images,
  cover,
  title,
  credit,
}: {
  images: string[];
  cover?: string | null;
  title: string;
  credit?: string | null;
}) {
  // The chosen cover must always be the first photo; preserve both photos
  // when an editor uploads two images for the same news story.
  const photos = Array.from(
    new Set([cover, ...images].filter((url): url is string => typeof url === "string" && url.length > 0))
  ).slice(0, 2);
  const [selected, setSelected] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    setSelected(0);
  }, [cover]);

  if (!photos.length) return null;

  const currentIndex = Math.min(selected, photos.length - 1);
  const current = photos[currentIndex];
  // Show a concise visible attribution; full author/license/URL remain in the info panel.
  const sourceName = credit?.split(/[,;|।\n]/)[0]?.replace(/https?:\/\/\S+/g, "").trim().slice(0, 90) || null;

  function selectNext(direction: number) {
    setSelected((value) => (value + direction + photos.length) % photos.length);
  }

  return (
    <section aria-label="खबर की तस्वीरें" className="border-y border-slate-100 bg-slate-50">
      <div
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 sm:aspect-[16/9]"
        onTouchStart={(event) => {
          startX.current = event.touches[0]?.clientX ?? null;
        }}
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
          alt={title + " — फोटो " + (currentIndex + 1)}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain"
        />
        {credit && (
          <details className="absolute bottom-2.5 right-2.5 z-10 max-w-[calc(100%-1.25rem)] sm:bottom-3 sm:right-3">
            <summary
              aria-label="तस्वीर का श्रेय और लाइसेंस देखें"
              title="तस्वीर का श्रेय"
              className="flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-full bg-slate-950/75 text-white shadow-sm backdrop-blur-sm hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <Info size={15} aria-hidden="true" />
            </summary>
            <div className="absolute bottom-full right-0 mb-2 max-h-48 w-[min(82vw,330px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 text-[11px] leading-5 text-slate-700 shadow-xl">
              <p className="mb-1 font-bold text-slate-900">तस्वीर का श्रेय और उपयोग अधिकार</p>
              <p className="break-words">
                {credit.split(/(https?:\/\/[^\s;]+)/g).map((part, index) =>
                  /^https?:\/\//.test(part) ? (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-red-700 underline">
                      मूल फोटो
                    </a>
                  ) : part
                )}
              </p>
              {credit.includes("CC BY-SA 4.0") && (
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="mt-1 block text-red-700 underline">
                  CC BY-SA 4.0 लाइसेंस
                </a>
              )}
              {credit.includes("CC BY 4.0") && (
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="mt-1 block text-red-700 underline">
                  CC BY 4.0 लाइसेंस
                </a>
              )}
            </div>
          </details>
        )}
        {photos.length > 1 && (
          <>
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white">
              <Images size={14} aria-hidden="true" /> {currentIndex + 1}/{photos.length}
            </span>
            <button
              type="button"
              onClick={() => selectNext(-1)}
              aria-label="पिछली फोटो"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => selectNext(1)}
              aria-label="अगली फोटो"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white p-3">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={"फोटो " + (index + 1) + " देखें"}
              aria-pressed={currentIndex === index}
              className={"relative h-14 w-20 overflow-hidden rounded-lg border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 " +
                (currentIndex === index ? "border-red-700 shadow-sm" : "border-slate-200 hover:border-red-300")}
            >
              <Image
                src={photo}
                alt={"फोटो " + (index + 1)}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
          <span className="text-xs font-semibold text-slate-500">फोटो चुनें</span>
        </div>
      )}
    </section>
  );
}
