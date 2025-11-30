"use client";

import React, { useEffect, useState } from "react";
import CheckoutSheet, { type CheckoutItem } from "@/components/CheckoutSheet";
import BuyButton from "@/components/BuyButton";

const getImg = (image_id?: string | null) => {
  if (!image_id) return '/images/cards/iTunes.png';
  return `/api/directus/assets/${image_id}?width=600&height=300&fit=cover`;
};

type Variant = {
  id: string | number;
  name: string;
  sku?: string | null;
  qty?: number;
  price: number;
  currency?: string;
  image_id: string | null;
  product_id: string | number | null;
  product_slug?: string | null;
  is_active?: boolean;
};

// ====== Currency helpers (local) ======

type ExchangeRates = Record<string, number>;

type Settings = {
  base_currency: string;
  exchange_rates: ExchangeRates;
};

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const val = document.cookie.split("; ")
    .find(r => r.startsWith(name + "="))?.split("=")[1];
  return val ? String(val).toUpperCase() : undefined;
}

function convert(amountBase: number, from: string, to: string, rates: ExchangeRates) {
  const FROM = String(from || "USD").toUpperCase();
  const TO = String(to || "USD").toUpperCase();
  if (!rates[FROM] || !rates[TO]) return amountBase;
  const inUSD = amountBase / rates[FROM];
  return inUSD * rates[TO];
}

function fmt(amount: number, currency: string, locale = "ar") {
  try { return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
}

export default function ITunes() {
  // حالات المودال العام
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<CheckoutItem | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [rawJson, setRawJson] = useState<any>(null);

  const [settings, setSettings] = useState<Settings | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    const onChange = (e: any) => {
      const val = ((e?.detail as string) || readCookie("currency") || "USD").toUpperCase();
      setCurrency(val);
    };
    const onFocus = () => {
      const c2 = readCookie("currency");
      if (c2) setCurrency(c2);
    };

    async function fetchVariants() {
      try {
        const res = await fetch(
          `/api/directus/items/product_variants?limit=-1&fields=*,image.id,product_id.id,product_id.slug,product_id.name&filter[product_id][slug][_eq]=cards/iTunes&filter[is_active][_eq]=true`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        setRawJson(data);
        try {
          const resSettings = await fetch("/api/directus/items/settings?limit=1", { cache: "no-store" });
          const js = await resSettings.json();
          const item = Array.isArray(js?.data) ? js.data[0] : js?.data;
          if (item) {
            const base = String(item.base_currency || "USD").toUpperCase();
            const raw = item.exchange_rates || { USD: 1 };
            const norm: ExchangeRates = Object.fromEntries(
              Object.entries(raw).map(([k, v]) => [String(k).toUpperCase(), Number(v)])
            );
            if (!norm[base]) norm[base] = 1;
            setSettings({ base_currency: base, exchange_rates: norm });
          }
        } catch {}
        const c = readCookie("currency");
        setCurrency((c || "USD").toUpperCase());
        if (data?.data) {
          const normalized: Variant[] = data.data.map((v: any) => ({
            id: v.id,
            name: v.name ?? v.title ?? "بدون اسم",
            sku: v.sku ?? null,
            qty: Number(v.qty ?? 0),
            price: Number(v.price ?? 0),
            currency: v.currency ?? "USD",
            // handle when image is an object (Directus) or just an id
            image_id: v.image?.id ?? v.image_id ?? null,
            // handle when product_id is an object or just an id
            product_id: v.product_id?.id ?? v.product_id ?? null,
            product_slug: v.product_id?.slug ?? v.product_slug ?? null,
            is_active: Boolean(v.is_active),
          }));
          setVariants(normalized);
        }
      } catch (e) {
        console.error("Failed to fetch variants", e);
      }
    }
    fetchVariants();

    window.addEventListener("currency-changed", onChange as any);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("currency-changed", onChange as any);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const iTunes_SLUG = "iTunes";
  let visible = variants.filter(v => (v.product_slug || "").toLowerCase() === iTunes_SLUG);
  // fallback: لو ما لقى بناءً على السلغ، اعرض كل الفيرينتس مؤقتًا لنتأكد من البيانات
  if (visible.length === 0) visible = variants;

  console.log({ total: variants.length, visible: visible.length, sample: variants.slice(0,3) });

  return (
    <section
      className="relative z-10 overflow-hidden text-white min-h-screen pt-[120px] pb-16"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      {/* صورة الهيرو */}
      <img
        src="/images/cards/iTunes.png"
        alt="iTunes"
        className="absolute left-[-100px] top-14 h-screen opacity-100 pointer-events-none select-none hidden lg:block"
      />

      {/* ديكور الخلفية */}
      <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100">
        <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
          <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)" />
          <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_25:217)" />
          <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear_25:217)" />
          <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" stroke="url(#paint4_linear_25:217)" />
          <circle opacity="0.8" cx="356" cy="290" r="179.5" transform="rotate(-30 356 290)" stroke="url(#paint5_linear_25:217)" />
          <circle opacity="0.8" cx="191.659" cy="302.659" r="133.362" transform="rotate(133.319 191.659 302.659)" fill="url(#paint6_linear_25:217)" />
          <defs>
            <linearGradient id="paint0_linear_25:217" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="paint1_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9997 182) rotate(90) scale(18)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="paint2_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76.9997 288) rotate(90) scale(34)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear_25:217" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear_25:217" x1="184.521" y1="182.159" x2="184.521" y2="448.882" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear_25:217" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear_25:217" x1="118.524" y1="29.2497" x2="166.965" y2="338.63" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="wow fadeInUp mx-auto max-w-[800px] text-center" data-wow-delay=".2s">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {visible.length === 0 ? (
              <div className="col-span-4 text-center text-gray-200 py-20">لا توجد باقات متاحة حالياً.</div>
            ) : (
              visible.map((v) => (
                <div key={v.id} title={v.name} className="relative rounded-xl overflow-hidden shadow-md transition shadow-lg shadow-yellow-500/30">
                  <div className="p-[3px] rounded-xl bg-gradient-to-br from-red-600 to-yellow-400">
                    <div className="backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl border border-transparent transition-transform duration-300 transform hover:-translate-y-2">
                      <img src={getImg(v.image_id)} alt={v.name} className="w-full h-44 object-cover rounded-t-xl" />
                      <div className="p-6 text-center text-white">
                        <h3 className="text-sm font-semibold mb-1">{v.name}</h3>
                        {(() => {
                          const base = Number(v.price ?? 0);
                          if (!settings) return (
                            <p className="text-xs text-green-400 font-bold">USD {base.toFixed(2)}</p>
                          );
                          const converted = convert(base, settings.base_currency, currency, settings.exchange_rates);
                          return (
                            <p className="text-xs text-green-400 font-bold">{fmt(converted, currency)}</p>
                          );
                        })()}
                        <BuyButton
                          variant="danger"
                          label="شراء"
                          item={v as any}
                          onClick={() => {
                            const basePrice = Number(v.price ?? 0);
                            const finalPrice = settings
                              ? convert(basePrice, settings.base_currency, currency, settings.exchange_rates)
                              : basePrice;
                            setItem({ name: v.name, sku: v.sku ?? String(v.id), price: Number(finalPrice.toFixed(2)) });
                            setOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* مودال الدفع */}
        {item && (
          <CheckoutSheet
            open={open}
            onClose={() => { setOpen(false); setItem(null); }}
            item={item}
            mode="playerId"
            labelOverride="Player ID"
            placeholderOverride="123456789"
            onConfirm={async (data) => {
              try {
                const r = await fetch("/api/custom-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const j = await r.json();
                if (!j.ok) throw new Error(j.error || "فشل إنشاء الطلب");
                alert(`تم إنشاء الطلب بنجاح: ${j.orderId}`);
              } catch (e: any) {
                alert(e?.message || "تعذر إنشاء الطلب");
              } finally {
                setOpen(false);
                setItem(null);
              }
            }}
          />
        )}
      </div>
    </section>
  );
}