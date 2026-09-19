"use client";

import { useEffect, useState } from "react";

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
    <div className="text-sm font-semibold text-slate-600">
      👁 कुल विज़िटर:{" "}
      <span className="font-black text-red-700">
        {total.toLocaleString("en-IN")}
      </span>
    </div>
  );
}
