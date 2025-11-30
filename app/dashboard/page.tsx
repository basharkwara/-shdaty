"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getBrowserSupabase from "@/lib/supabase-browser";

// ===== Currency display helpers =====
function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const val = document.cookie.split("; ")
    .find(r => r.startsWith(name + "="))?.split("=")[1];
  return val ? String(val).toUpperCase() : undefined;
}
function fmtCurrency(n: number, currency?: string) {
  const cur = (currency || readCookie("currency") || "USD").toUpperCase();
  try { return new Intl.NumberFormat("ar", { style: "currency", currency: cur }).format(n); }
  catch { return `${n.toLocaleString()} ${cur}`; }
}
function setCartLS(list: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("cart:updated"));
}

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

const KEY = "cart";
const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const clearCart = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify([]));
  window.dispatchEvent(new Event("cart:updated"));
};

export default function Dashboard() {
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
    const update = () => setCart(getCart());
    update();
    const onCur = () => setCurrency(readCookie("currency") || "USD");
    onCur();
    window.addEventListener("cart:updated", update);
    window.addEventListener("storage", update);
    window.addEventListener("currency-changed", onCur);
    window.addEventListener("focus", onCur);
    return () => {
      window.removeEventListener("cart:updated", update);
      window.removeEventListener("storage", update);
      window.removeEventListener("currency-changed", onCur);
      window.removeEventListener("focus", onCur);
    };
  }, []);

  const total = React.useMemo(() =>
    cart.reduce((sum, i) => sum + (Number(i.price) * (Number(i.qty) || 0)), 0)
  , [cart]);

  return (
    <section
      className="min-h-screen py-24 text-white"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">🛒 سلة الطلبات</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCart(getCart())}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2"
              title="تحديث"
            >
              تحديث
            </button>
            <Link href="/" className="text-yellow-300 hover:text-yellow-400">الرئيسية</Link>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="mb-6 w-20 h-20 rounded-2xl bg-white/10 grid place-items-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white/90" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4h-.7a1 1 0 0 0-1 .8L4 10.5a2.5 2.5 0 0 0 2.5 3H17a1 1 0 0 0 .96-.74l1.6-6A1 1 0 0 0 18.6 5H8.2"/>
                <circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">سلّة الطلبات فاضية 🛒</h2>
            <p className="text-white/70 mb-6">بلّش من الخدمات أو الصفحة الرئيسية.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/services" className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold">استعرض الخدمات</a>
              <a href="/" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white">الصفحة الرئيسية</a>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((it, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-xl p-4 flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{it.name}</div>
                  <div className="text-white/70 text-sm truncate">
                    SKU: {it.id}
                    {it.playerId ? ` • PlayerID: ${it.playerId}` : ""}
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    السعر/وحدة: <span className="text-white tabular-nums" suppressHydrationWarning>
                      {fmtCurrency(Number(it.price), currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="decrease"
                    className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 transition-all duration-200 ease-in-out"
                    onClick={() => {
                      const next = [...cart];
                      next[idx].qty = Math.max(1, (Number(next[idx].qty) || 1) - 1);
                      setCartLS(next);
                      setCart(next);
                    }}
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={it.qty}
                    onChange={e => {
                      const v = Math.max(1, (Number(e.target.value || 1) || 1));
                      const next = [...cart];
                      next[idx].qty = v;
                      setCartLS(next);
                      setCart(next);
                    }}
                    className="w-14 text-center rounded bg-white/5 border border-white/10 p-1 transition-all duration-200 ease-in-out focus:border-white/30 tabular-nums"
                    suppressHydrationWarning
                  />
                  <button
                    aria-label="increase"
                    className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 transition-all duration-200 ease-in-out"
                    onClick={() => {
                      const next = [...cart];
                      next[idx].qty = (Number(next[idx].qty) || 0) + 1;
                      setCartLS(next);
                      setCart(next);
                    }}
                  >+</button>
                </div>

                <div className="text-yellow-300 font-bold whitespace-nowrap tabular-nums" suppressHydrationWarning>
                  {fmtCurrency(Number(it.price) * (Number(it.qty) || 0), currency)}
                </div>

                <button
                  className="px-3 py-2 rounded bg-red-500/80 hover:bg-red-500 text-white"
                  onClick={() => {
                    const next = cart.filter((_, i) => i !== idx);
                    setCartLS(next);
                    setCart(next);
                  }}
                >حذف</button>
              </div>
            ))}

            <div className="flex justify-between items-center border-t border-white/15 pt-4">
              <span className="text-white/80">الإجمالي</span>
              <span
                className="text-3xl font-extrabold bg-gradient-to-r from-[#FF9E0D] to-[#FFD36A] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,180,0,0.35)] tabular-nums"
                suppressHydrationWarning
              >
                {fmtCurrency(total, currency)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
            <button
              className="flex-1 rounded-lg bg-gradient-to-r from-[#FF9E0D] to-[#FFD36A] py-3 font-semibold hover:opacity-90 shadow-[0_0_12px_rgba(255,180,0,0.35)] text-neutral-900"
              onClick={() => setCheckoutOpen(true)}
            >المتابعة للدفع</button>
              <button onClick={() => { clearCart(); setCart([]); }} className="px-4 rounded-lg bg-white/10 hover:bg-white/20">تفريغ السلة</button>
            </div>
          </div>
        )}
      </div>
      <div className={`fixed inset-0 z-[200] transition ${checkoutOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${checkoutOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setCheckoutOpen(false)}
        />
        {/* panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-xl bg-neutral-900 text-white border-l border-white/10 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${checkoutOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">إتمام الدفع</h2>
            <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-all duration-200" onClick={() => setCheckoutOpen(false)}>إغلاق</button>
          </div>

          {/* Customer info */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm text-white/70">الاسم</span>
              <input id="chk-name" className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-3 outline-none focus:border-white/30 transition-all duration-200" placeholder="اسمك" />
            </label>
            <label className="block">
              <span className="text-sm text-white/70">البريد أو واتساب</span>
              <input id="chk-contact" dir="ltr" className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-3 outline-none focus:border-white/30 transition-all duration-200" placeholder="you@example.com | +90..." />
            </label>
            <label className="block">
              <span className="text-sm text-white/70">ملاحظات (اختياري)</span>
              <textarea id="chk-notes" rows={3} className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-3 outline-none focus:border-white/30 transition-all duration-200" placeholder="أي تفاصيل إضافية..." />
            </label>
          </div>

          {/* Payment method */}
          <div className="mt-6">
            <span className="text-sm text-white/70">وسيلة الدفع</span>
            <select id="chk-method" className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 p-3 outline-none focus:border-white/30 transition-all duration-200">
              <option value="paytr">PayTR</option>
              <option value="iyzico">Iyzipay</option>
              <option value="stripe">Stripe</option>
              <option value="manual">تحويل يدوي</option>
            </select>
          </div>

          {/* Cart summary */}
          <div className="mt-8 space-y-3">
            <div className="text-lg font-semibold">ملخص الطلب</div>
            {cart.length === 0 ? (
              <div className="text-white/70">السلة فارغة.</div>
            ) : (
              <div className="space-y-2">
                {cart.map((it, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <div className="text-sm truncate">{it.name} <span className="opacity-70">× {it.qty}</span></div>
                    <div className="text-sm font-semibold tabular-nums" suppressHydrationWarning>{fmtCurrency(Number(it.price) * (Number(it.qty) || 0), currency)}</div>
                  </div>
                ))}
              </div>
            )}
            <span
              className="text-3xl font-extrabold bg-gradient-to-r from-[#FF9E0D] to-[#FFD36A] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,180,0,0.35)] tabular-nums"
              suppressHydrationWarning
            >
              {fmtCurrency(total, currency)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 py-3 font-semibold hover:opacity-90 transition-all duration-200"
              onClick={async () => {
                // 🔐 منع إتمام الدفع بدون تسجيل دخول
                let userId: string | null = null;
                try {
                  const supabase = getBrowserSupabase();
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  userId = user?.id ?? null;
                  if (!user) {
                    alert("يلزم تسجيل الدخول لمتابعة الدفع. سيتم تحويلك إلى صفحة تسجيل الدخول.");
                    setCheckoutOpen(false);
                    router.push("/signin");
                    return;
                  }
                } catch (err) {
                  console.warn("تعذر التحقق من حالة تسجيل الدخول", err);
                  alert("تعذر التحقق من حالة تسجيل الدخول. حاول مجددًا أو قم بتسجيل الدخول يدويًا.");
                  setCheckoutOpen(false);
                  router.push("/signin");
                  return;
                }

                if (!userId) {
                  alert("لم يتم العثور على حساب مستخدم فعّال، الرجاء تسجيل الدخول ثم المحاولة من جديد.");
                  setCheckoutOpen(false);
                  router.push("/signin");
                  return;
                }

                const name = (document.getElementById("chk-name") as HTMLInputElement)?.value?.trim();
                const contact = (document.getElementById("chk-contact") as HTMLInputElement)?.value?.trim();
                const notes = (document.getElementById("chk-notes") as HTMLTextAreaElement)?.value?.trim();
                const method = (document.getElementById("chk-method") as HTMLSelectElement)?.value;

                if (!contact) { alert("رجاءً أدخل بريد أو رقم واتساب للتواصل"); return; }
                if (cart.length === 0) { alert("السلة فارغة"); return; }

                const customerKey = cart.find(x => x.playerId)?.playerId || contact || name || "GUEST";
                const items = cart.map(it => ({
                  sku: Number(it.id),
                  name: it.name,
                  price: Number(it.price),
                  qty: Number(it.qty) || 1,
                }));

                try {
                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      status: "pending",
                      customer_name: name || customerKey || "GUEST",
                      contact,
                      payment_method: method,
                      currency,
                      items,
                      total: Number(total),
                      user_id: userId,
                      notes: notes || undefined,
                    }),
                  });
                  const data = await res.json();

                  if (!res.ok || data?.ok === false) {
                    console.error("Order error:", data);
                    const msg =
                      (typeof data?.error === "string" && data.error) ||
                      data?.error?.message ||
                      "فشل إنشاء الطلب";
                    alert(msg);
                    return;
                  }

                  const orderId =
                    data?.data?.id ??
                    data?.id ??
                    data?.order?.id ??
                    data?.order?.order_id ??
                    data?.orderId ??
                    "—";

                  clearCart();
                  setCart([]);
                  setCheckoutOpen(false);
                  alert(`تم إنشاء الطلب بنجاح. رقم الطلب: ${orderId}`);
                } catch (e) {
                  console.error(e);
                  alert("حدث خطأ غير متوقع");
                }
              }}
            >
              تأكيد وإتمام الدفع
            </button>
            <button className="px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200" onClick={() => setCheckoutOpen(false)}>رجوع</button>
          </div>
        </div>
      </div>
    </section>
  );
}