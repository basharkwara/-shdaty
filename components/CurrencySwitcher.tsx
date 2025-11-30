"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SUPPORTED = ["USD", "TRY", "AED", "SYP"] as const;

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function CurrencySwitcher() {
  const router = useRouter();
  const [cur, setCur] = useState<string>("USD");

  useEffect(() => {
    setCur(readCookie("currency") || "USD");
  }, []);

  function setCurrency(value: string) {
    document.cookie = `currency=${value};path=/;max-age=${60 * 60 * 24 * 365}`; // سنة
    setCur(value);
    router.refresh(); // يحدّث Server Components لعرض الأسعار بالعملة المختارة
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-white/90">
      <span className="hidden sm:inline">العملة</span>
      <select
        aria-label="تغيير العملة"
        className="rounded-md border border-white/20 bg-transparent px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
        value={cur}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {SUPPORTED.map((c) => (
          <option key={c} value={c} className="text-black">
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}