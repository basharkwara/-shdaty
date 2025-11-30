"use client";

import React, { useEffect, useState } from "react";
import CheckoutSheet, { type CheckoutItem } from "@/components/CheckoutSheet";
import BuyButton from "@/components/BuyButton";

// نوع الصنف القادم من ديركتس
type Variant = {
  id: number;
  name: string;
  sku?: string | null;
  price?: number | null;
  image_id?: string | null; // UUID
  product_id?: number | { slug?: string; name?: string } | null;
  is_active?: boolean;
};

// دالة مساعدة لبناء رابط الصورة من Directus
const getImg = (image_id?: string | null) => {
  if (!image_id) return '/images/fifamob.png';
  return `/api/directus/assets/${image_id}?width=600&height=300&fit=cover`;
};

// ====== Currency helpers (local) ======

type ExchangeRates = Record<string, number>;

type Settings = {
  base_currency: string;
  exchange_rates: ExchangeRates;
};

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie.split("; ")
    .find(r => r.startsWith(name + "="))?.split("=")[1];
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

export default function FifaMobilePage() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<CheckoutItem | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [rawJson, setRawJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    const onChange = (e: any) => {
      const val = (e?.detail as string) || readCookie("currency") || "USD";
      setCurrency(val);
    };
    const onFocus = () => {
      const c2 = readCookie("currency");
      if (c2) setCurrency(c2);
    };
    const fetchVariants = async () => {
      try {
        const productSlug = "FIFA_Mobile"; // غيّرها إذا كان slug مختلفًا في Directus

        // اجلب الـ variants مباشرة عبر فلترة slug المنتج المرتبط
        const fields = [
          "id",
          "name",
          "price",
          "image.id",
          "is_active",
          "product_id.id",
          "product_id.slug",
          "product_id.name"
        ].join(",");

        const url =
          "/api/directus/items/product_variants" +
          `?fields=${encodeURIComponent(fields)}` +
          `&filter[product_id][slug][_eq]=${encodeURIComponent(productSlug)}` +
          `&filter[is_active][_eq]=true` +
          `&sort=sort`;

        const res = await fetch(url + `&limit=-1`, { cache: "no-store" });
        let json = await res.json();
        setRawJson(json);
        console.log('FIFA variants:', { count: Array.isArray(json?.data) ? json.data.length : 0, sample: Array.isArray(json?.data) ? json.data.slice(0,3) : [] });

        // fetch settings & currency
        try {
          const resSettings = await fetch("/api/directus/items/settings?limit=1", { cache: "no-store" });
          const js = await resSettings.json();
          const item = Array.isArray(js?.data) ? js.data[0] : js?.data;
          if (item) {
            setSettings({
              base_currency: item.base_currency || "USD",
              exchange_rates: item.exchange_rates || { USD: 1 },
            });
          }
        } catch {}
        const c = readCookie("currency");
        if (c) setCurrency(c);

        // في حال لم ترجع بيانات، أعد المحاولة بلا فلتر is_active للمراجعة
        if (Array.isArray(json?.data) && json.data.length === 0) {
          const urlNoActive = url.replace(/&filter\[is_active\]\[_eq\]=true/, "");
          const res2 = await fetch(urlNoActive, { cache: "no-store" });
          json = await res2.json();
          setRawJson(json);
        }

        if (Array.isArray(json?.data)) {
          const normalized = json.data.map((v: any) => ({
            id: v.id,
            name: v.name ?? `Variant ${v.id}`,
            sku: v.sku ?? null,
            price: typeof v.price !== "undefined" ? v.price : null,
            image_id: v.image?.id ?? v.image_id ?? null,
            product_id: v.product_id?.id ?? v.product_id ?? null,
            is_active: typeof v.is_active !== "undefined" ? v.is_active : true,
          })) as Variant[];

          setVariants(normalized);
        } else {
          setVariants([]);
        }

      } catch (e) {
        console.error("Fetch variants failed", e);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
    window.addEventListener("currency-changed", onChange as any);
    window.addEventListener("focus", onFocus);
    return () => {
      // Remove currency listeners
      window.removeEventListener("currency-changed", onChange as any);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <section
      className="relative z-10 overflow-hidden text-white min-h-screen pt-[120px] pb-16"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <img
        src="/images/football.png"
        alt="football"
        className="absolute left-[-20px] top-12 h-[75vh] w-auto opacity-80 pointer-events-none select-none hidden lg:block"
      />
      <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
          {loading ? (
            <div className="text-white/80">...جاري تحميل الأسعار</div>
          ) : variants.length === 0 ? (
            <div className="mt-6 rounded-xl bg-white/10 p-6 text-white/90">
              لا توجد أسعار معروضة لهذا المنتج حالياً.
              تحقّق من أنّ:
              <ul className="list-disc text-sm mt-2 text-white/80 text-right pr-6">
                <li>المنتج موجود في Products والـ slug يساوي تماماً <b>FIFA_Mobile</b>.</li>
                <li>قمت بربط الـ <b>product_variants</b> مع هذا المنتج عبر الحقل <b>product_id</b>.</li>
                <li>حالة السجل Published وخانة <b>is_active</b> مفعّلة.</li>
                <li>الصلاحيات (Access Policies) تسمح بالقراءة للـ Public على الحقول المطلوبة.</li>
              </ul>
              {rawJson && (
                <pre className="mt-4 text-xs bg-gray-900 p-3 rounded text-left overflow-auto max-h-48">{JSON.stringify(rawJson, null, 2)}</pre>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {variants.map((v) => (
                <div key={v.id} title={v.name} className="relative rounded-xl overflow-hidden shadow-md transition shadow-lg shadow-yellow-500/30">
                  <div className="p-[3px] rounded-xl bg-gradient-to-br from-red-600 to-yellow-400">
                    <div className="backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl border border-transparent transition-transform duration-300 transform hover:-translate-y-2">
                      <img src={getImg(v.image_id)} alt={v.name} className="w-full h-44 object-cover rounded-t-xl" />
                      <div className="p-6 text-center text-white">
                        <h3 className="text-sm font-semibold mb-1">{v.name}</h3>
                        {(() => {
                          const base = (typeof v.price !== 'undefined' && v.price !== null) ? Number(v.price) : null;
                          if (base === null) return <p className="text-xs text-green-400 font-bold">—</p>;
                          if (!settings) return <p className="text-xs text-green-400 font-bold">USD {base.toLocaleString()}</p>;
                          const converted = convert(base, settings.base_currency, currency, settings.exchange_rates);
                          return (
                            <p className="text-xs text-green-400 font-bold">{fmt(converted, currency)}</p>
                          );
                        })()}
                        <BuyButton
                          variant="danger"
                          label="شراء"
                          onClick={() => {
                            const sku = (v.sku && v.sku.length > 0) ? v.sku : `FIFA_${v.id}`;
                            const basePrice = Number(v.price ?? 0);
                            const finalPrice = settings
                              ? convert(basePrice, settings.base_currency, currency, settings.exchange_rates)
                              : basePrice;
                            setItem({ name: v.name, sku, price: Number(finalPrice.toFixed(2)) });
                            setOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {item && (
        <CheckoutSheet
          open={open}
          onClose={() => { setOpen(false); setItem(null); }}
          item={item}
          mode="playerId"
          labelOverride="Player ID"
          placeholderOverride="123456789"
          onConfirm={(data) => {
            fetch("/api/custom-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
              .then((r) => r.json())
              .then((j) => {
                if (j?.ok) {
                  alert(`تم إنشاء الطلب #${j.orderId}`);
                } else {
                  alert("تعذر إنشاء الطلب");
                }
                setOpen(false);
                setItem(null);
              })
              .catch(() => {
                alert("خطأ بالشبكة");
                setOpen(false);
                setItem(null);
              });
          }}
        />
      )}
    </section>
  );
}