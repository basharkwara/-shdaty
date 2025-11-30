

"use client";
import { useEffect, useMemo, useState } from "react";

// Local types
type ExchangeRates = Record<string, number>;

type Settings = {
  base_currency: string;
  exchange_rates: ExchangeRates;
};

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="))
    ?.split("=")[1];
}

function convert(amountBase: number, from: string, to: string, rates: ExchangeRates) {
  if (!rates[from] || !rates[to]) return amountBase;
  const inUSD = amountBase / rates[from];
  return inUSD * rates[to];
}

function fmt(amount: number, currency: string, locale = "ar") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function PriceLocal({
  base,
  className = "",
  locale = "ar",
}: {
  base: number;
  className?: string;
  locale?: string;
}) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    // Fetch settings once from internal proxy (avoids CORS)
    fetch("/api/directus/items/settings?limit=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const item = Array.isArray(d?.data) ? d.data[0] : d?.data;
        if (item) {
          setSettings({
            base_currency: item.base_currency || "USD",
            exchange_rates: item.exchange_rates || { USD: 1 },
          });
        }
      })
      .catch(() => {});

    // Initial cookie
    const c = readCookie("currency");
    if (c) setCurrency(c);

    // Live updates (from CurrencySwitcher)
    const onChange = (e: any) => {
      const val = (e?.detail as string) || readCookie("currency") || "USD";
      setCurrency(val);
    };
    const onFocus = () => {
      const c2 = readCookie("currency");
      if (c2) setCurrency(c2);
    };
    window.addEventListener("currency-changed", onChange as any);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("currency-changed", onChange as any);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const text = useMemo(() => {
    const baseNum = Number(base || 0);
    if (!settings) return `USD ${baseNum.toFixed(2)}`;
    const converted = convert(baseNum, settings.base_currency, currency, settings.exchange_rates);
    return fmt(converted, currency, locale);
  }, [base, settings, currency, locale]);

  return <span className={className}>{text}</span>;
}