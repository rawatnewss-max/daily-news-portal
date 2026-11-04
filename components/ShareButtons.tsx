"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Send, Share2 } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(title + "\n" + window.location.href);
    openShare("https://wa.me/?text=" + text);
  }

  function shareFacebook() {
    openShare("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
  }

  function shareTelegram() {
    openShare(
      "https://t.me/share/url?url=" + encodeURIComponent(window.location.href) +
      "&text=" + encodeURIComponent(title)
    );
  }

  async function copyLink() {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      window.prompt("खबर का लिंक कॉपी करें:", link);
    }
  }

  async function shareNative() {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, text: title, url: window.location.href });
    } catch (error) {
      // Closing the system share sheet is not an error.
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyLink();
    }
  }

  const baseClass = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 sm:text-sm";

  return (
    <section aria-label="खबर शेयर करें" className="mt-7 border-t border-slate-200 pt-5">
      <h2 className="mb-3 text-base font-extrabold text-slate-900">खबर शेयर करें</h2>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={shareWhatsApp} className={baseClass + " bg-[#168b48] text-white hover:bg-[#116d39]"} aria-label="WhatsApp पर खबर शेयर करें">
          <MessageCircle size={17} aria-hidden="true" /> WhatsApp
        </button>
        <button type="button" onClick={shareFacebook} className={baseClass + " bg-[#1877F2] text-white hover:bg-[#1260c6]"} aria-label="Facebook पर खबर शेयर करें">
          <span aria-hidden="true" className="text-base font-black">f</span> Facebook
        </button>
        <button type="button" onClick={shareTelegram} className={baseClass + " bg-[#229ed9] text-white hover:bg-[#167aa9]"} aria-label="Telegram पर खबर शेयर करें">
          <Send size={15} aria-hidden="true" /> Telegram
        </button>
        <button type="button" onClick={copyLink} className={baseClass + " border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"} aria-label="खबर का लिंक कॉपी करें">
          {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
          {copied ? "लिंक कॉपी हो गया" : "कॉपी लिंक"}
        </button>
        <button type="button" onClick={shareNative} className={baseClass + " border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} aria-label="अन्य ऐप से खबर शेयर करें">
          <Share2 size={16} aria-hidden="true" /> अन्य ऐप
        </button>
      </div>
    </section>
  );
}
