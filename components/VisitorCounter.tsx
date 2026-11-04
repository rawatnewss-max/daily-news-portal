"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visit", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.total === "number") {
          setTotal(data.total);
        }
      })
      .catch(() => {});
  }, []);

  if (total === null) return null;

  return (
    <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-slate-200" aria-label={"कुल विज़िटर " + total}>
      <Eye size={15} className="text-red-300" aria-hidden="true" />
      <span className="hidden sm:inline">कुल विज़िटर:</span>
      <span className="font-black text-red-300 tabular-nums">
        {total.toLocaleString("en-IN")}
      </span>
    </div>
  );
}
