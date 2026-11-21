"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Home, Newspaper, Search } from "lucide-react";

const items = [
  { href: "/", label: "होम", Icon: Home },
  { href: "/category/ajmer", label: "अजमेर", Icon: Newspaper },
  { href: "/category/world", label: "दुनिया", Icon: Globe2 },
  { href: "/search", label: "खोजें", Icon: Search },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="मोबाइल त्वरित नेविगेशन" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_18px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[51px] flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700 ${active ? "text-red-700" : "text-slate-600 hover:text-red-700"}`}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
