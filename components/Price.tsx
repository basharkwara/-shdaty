"use client";
import { useEffect, useMemo, useState } from "react";

// نفس شكل الإعدادات يلي جهّزناه
type ExchangeRates = Record<string, number>;
type Settings = { base_currency: string; exchange_rates: ExchangeRates };

function readCookie(name: string) {
  return document.cookie.split("; ")
    .find((r) => r.startsWith(name + "="))?.split("=")[1];
}

function convert(amountBase: number, from: string, to: string, rates: ExchangeRates) {
  if (!rates[from] || !rates[to]) return amountBase;
  const inUSD = amountBase / rates[from];
  return inUSD * rates[to];
}

function fmt(amount: number, currency: string, locale = "ar") {
  try { return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
}

export default function Price({ base, className = "" }: { base: number; className?: string }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    // جلب الإعدادات مرة واحدة من بروكسي Directus
    fetch("/api/directus/items/settings?limit=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const item = Array.isArray(d?.data) ? d.data[0] : d?.data;
        if (item) setSettings({
          base_currency: item.base_currency || "USD",
          exchange_rates: item.exchange_rates || { USD: 1 },
        });
      })
      .catch(() => {});
    setCurrency(readCookie("currency") || "USD");
  }, []);

  const text = useMemo(() => {
    if (!settings) return `USD ${base.toFixed(2)}`;
    const converted = convert(base, settings.base_currency, currency, settings.exchange_rates);
    return fmt(converted, currency, "ar");
  }, [base, settings, currency]);

  return <span className={className}>{text}</span>;
}