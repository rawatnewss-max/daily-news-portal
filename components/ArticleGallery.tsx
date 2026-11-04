"use client";

import { useEffect, useRef, useState } from "react";
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
