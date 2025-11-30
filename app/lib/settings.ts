// app/lib/settings.ts

export type ExchangeRates = Record<string, number>;
export type Settings = {
  base_currency: string;
  exchange_rates: ExchangeRates;
};

/**
 * يجلب سجل الإعدادات (Singleton) من Directus عبر البروكسي الداخلي
 * حتى نتفادى مشاكل CORS ونستخدم نفس الدومين (localhost:3000).
 */
export async function getSettings(): Promise<Settings> {
  const res = await fetch("/api/directus/items/settings?limit=1", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  const data = await res.json();
  const item = Array.isArray(data?.data) ? data.data[0] : data?.data;

  return {
    base_currency: item?.base_currency ?? "USD",
    exchange_rates: item?.exchange_rates ?? { USD: 1 },
  };
}