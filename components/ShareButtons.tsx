"use client";

import { useEffect, useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const facebookShare = () => {
    window.open(
      https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)},
      "_blank"
    );
  };

  const whatsappShare = () => {
    window.open(
      https://wa.me/?text=${encodeURIComponent(title + "\n" + url)},
      "_blank"
    );
  };

  const instagramShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied");
  };

  return (
    <div className="my-6 border-y border-slate-200 py-4">
      <div className="mb-3 font-bold">खबर शेयर करें</div>

      <div className="flex flex-wrap items-center gap-3">

        <button
          onClick={facebookShare}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white"
          aria-label="Facebook पर शेयर करें"
        >
          <span className="text-xl font-black">f</span>
        </button>

        <button
          onClick={whatsappShare}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white"
          aria-label="WhatsApp पर शेयर करें"
        >
          <span className="text-lg">☎</span>
        </button>

        <button
          onClick={instagramShare}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white"
          aria-label="Instagram पर शेयर करें"
        >
          <span className="text-xl">◎</span>
        </button>

        <button
          onClick={copyLink}
          className="flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-bold"
        >
          🔗 Copy Link
        </button>

      </div>
    </div>
  );
}
