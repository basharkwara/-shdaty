"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getBrowserSupabase from "@/lib/supabase-browser";
// Local cart helpers (inline, to avoid missing module)
export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  payment?: string;
  playerId?: string;
  contact?: string;
  createdAt: number;
};

function readCookie(name: string) {
  return typeof document !== "undefined"
    ? document.cookie.split("; ")
        .find((r) => r.startsWith(name + "="))?.split("=")[1]
    : undefined;
}

function formatCurrency(amount: number, currency: string, locale = "ar") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function addToCart(item: CartItem) {
  try {
    const KEY = "cart";
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    const cur: CartItem[] = raw ? JSON.parse(raw) : [];

    // ندمج العناصر المتطابقة (حسب id + طريقة الدفع + playerId)
    const idx = cur.findIndex(
      (x) =>
        x.id === item.id &&
        (x.payment || "") === (item.payment || "") &&
        (x.playerId || "") === (item.playerId || "")
    );

    if (idx > -1) {
      cur[idx].qty += item.qty;
      // أبقِ السعر كسعر الوحدة، ولا تغيّر createdAt القديم
    } else {
      cur.push(item);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(cur));
      window.dispatchEvent(new Event("cart:updated"));
    }
  } catch {}
}

export type Mode = "gameId" | "email" | "username" | "none";

export type CheckoutItem = {
  name: string;
  sku: string;
  price: number;
};

export default function CheckoutSheet({
  open,
  onClose,
  item,
  mode,
  labelOverride,
  placeholderOverride,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  item: CheckoutItem | null;
  mode: Mode;
  labelOverride?: string;
  placeholderOverride?: string;
  onConfirm?: (data: {
    customerKey: string;
    qty: number;
    contact: string;
    method: string;
    total: number;
    item: CheckoutItem;
    mode: Mode;
  }) => void;
}) {
  const [idOrEmail, setIdOrEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [contact, setContact] = useState(""); // WhatsApp/Email اختياري
  // لم يعد هناك اختيار وسيلة دفع هنا—مرحلة السلة فقط
  const method = "cart" as const;
  const [busy, setBusy] = useState(false);
  const [currency, setCurrency] = useState<string>("USD");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const c = readCookie("currency");
    if (c) setCurrency(c);
  }, []);

  if (!open || !item) return null;

  const total = useMemo(() => +(item.price * qty).toFixed(2), [item.price, qty]);

  // نصوص افتراضية حسب النوع
  const defaultLabel =
    mode === "gameId" ? "Player ID / UID" :
    mode === "email" ? "البريد الإلكتروني" :
    mode === "username" ? "اسم المستخدم" :
    ""; // none

  const defaultPlaceholder =
    mode === "gameId" ? "مثال: 123456789" :
    mode === "email" ? "example@mail.com" :
    mode === "username" ? "username123" :
    "";

  const label = labelOverride ?? defaultLabel;
  const placeholder = placeholderOverride ?? defaultPlaceholder;

  const validate = (): string | null => {
    if (mode === "none") { setError(null); return null; }

    const v = idOrEmail.trim();
    let msg: string | null = null;
    if (mode === "gameId") {
      if (!/^\d{5,20}$/.test(v)) msg = "Player ID غير صالح (أرقام فقط 5–20 خانة).";
    } else if (mode === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "البريد الإلكتروني غير صالح.";
    } else if (mode === "username") {
      if (!/^[A-Za-z0-9_.-]{3,32}$/.test(v)) msg = "اسم المستخدم غير صالح.";
    }
    setError(msg);
    return msg;
  };

  const submit = async () => {
    const v = validate();
    if (v) return; // سيتم عرض الخطأ تحت الحقل

    setBusy(true);
    try {
      // نحاول جلب المستخدم الحالي من Supabase أولاً
      let userId: string | null = null;
      try {
        const supabase = getBrowserSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id ?? null;
      } catch (err) {
        console.warn("Unable to fetch Supabase user", err);
      }

      // ✅ منع إتمام الخطوة بدون تسجيل دخول
      if (!userId) {
        alert("يلزم تسجيل الدخول لمتابعة الطلب. سيتم تحويلك إلى صفحة تسجيل الدخول.");
        onClose();
        router.push("/signin");
        return; // لا نكمّل إنشاء الطلب أو إضافة السلة
      }

      // استدعِ onConfirm إن وُجد (لأي منطق إضافي خارجي)
      onConfirm?.({
        customerKey: idOrEmail,
        qty,
        contact,
        method,
        total,
        item,
        mode,
      });

      // تجهيز بيانات العناصر لإرسالها إلى Directus
      const orderItems = [
        {
          sku: item.sku,
          name: item.name,
          qty,
          price: item.price,
          total,
          playerId: idOrEmail || null,
        },
      ];

      // إنشاء الطلب في Directus عبر API الخاصة بنا
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            items: orderItems,
            total,
            currency,
            contact,
            notes: idOrEmail
              ? `Customer key (${mode}) = ${idOrEmail}`
              : undefined,
          }),
        });
      } catch (err) {
        console.error("Failed to create order in Directus:", err);
      }

      // أضف إلى السلة محليًا ثم حوّل إلى لوحة التحكم
      addToCart({
        id: item.sku,
        name: item.name,
        price: item.price, // سعر الوحدة وليس الإجمالي
        qty,
        payment: undefined,
        playerId: idOrEmail || undefined,
        contact,
        createdAt: Date.now(),
      });

      onClose();
      router.push("/dashboard");
    } catch (e) {
      alert("تعذّر إنشاء الطلب/الدفع، حاول مجددًا.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* الخلفية */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* مودال زجاجي: شيت سفلي على الموبايل + مودال وسطي على الديسكتوب */}
      <div className="relative w-[min(92vw,720px)] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl bg-transparent">
        <div className="grid md:grid-cols-2">
          {/* اللوحة اليسار: تفاصيل الباقة */}
          <div className="bg-white/10 backdrop-blur p-6 border-r border-white/10">
            <div className="flex items-center justify-between md:justify-start md:gap-3 mb-4">
              {/* مقبض سحب للموبايل */}
              <div className="h-1.5 w-12 rounded-full bg-white/20 md:hidden mx-auto" />
              <h2 className="text-lg font-bold hidden md:block">إضافة إلى السلة</h2>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/70">الباقة</div>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.name}</div>
                <div className="text-green-400 font-bold">{formatCurrency(item.price ?? 0, currency)}</div>
              </div>
              <div className="text-xs text-white/50 mt-1">SKU: {item.sku}</div>
            </div>
          </div>

          {/* اللوحة اليمين: نموذج البيانات والدفع */}
          <div className="bg-zinc-900/90 backdrop-blur p-6">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h2 className="text-lg font-bold">إضافة إلى السلة</h2>
              <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              {/* الحقل الديناميكي حسب النوع */}
              {mode !== "none" && (
                <label className="block">
                  <span className="text-sm text-white/70">{label}</span>
                  <input
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-2 outline-none"
                    value={idOrEmail}
                    onChange={(e) => { setIdOrEmail(e.target.value); if (error) setError(null); }}
                    placeholder={placeholder}
                  />
                  {mode === "gameId" && (
                    <div className="text-xs text-white/50 mt-1">ستجده في ملفك داخل اللعبة.</div>
                  )}
                  {mode === "email" && (
                    <div className="text-xs text-white/50 mt-1">سيرسل الكود/الإيصال إلى هذا البريد.</div>
                  )}
                  {error && (
                    <div className="mt-2 text-sm text-red-300">{error}</div>
                  )}
                </label>
              )}

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-white/70">الكمية</span>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-2"
                    value={qty}
                    onChange={(e) => { setQty(Math.max(1, Number(e.target.value) || 1)); if (error) setError(null); }}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-white/70">التواصل (اختياري)</span>
                  <input
                    className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-2"
                    value={contact}
                    onChange={(e) => { setContact(e.target.value); if (error) setError(null); }}
                    placeholder="Email أو WhatsApp"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4">
                <div>الإجمالي</div>
                <div className="text-2xl font-bold">{formatCurrency(total, currency)}</div>
              </div>

              <button
                disabled={busy}
                onClick={submit}
                className="w-full rounded-lg bg-white text-black font-semibold py-2 hover:opacity-90 disabled:opacity-60 transition"
              >
                {busy ? "جاري المعالجة..." : "إضافة إلى السلة"}
              </button>

              {/* زر الإغلاق على الديسكتوب */}
              <button onClick={onClose} className="hidden md:inline-block mt-2 text-white/70 hover:text-white text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}