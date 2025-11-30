import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

type DirectusOrder = {
  id: number | string;
  status: string;
  customer_name: string;
  contact: string;
  notes?: string | null;
  payment_method?: string | null;
  total: number;
  currency: string;
  created_at: string;
  items?: unknown;
};

type OrdersPageProps = {
  searchParams?: {
    status?: string;
  };
};

// ✅ دالة صغيرة تجيب الـ user_id من Supabase
async function getCurrentUserId(): Promise<string> {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // ما بدنا نعدل الكوكيز من هون، فبنخليهم فاضيين
      set() {},
      remove() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // إذا ما في مستخدم → رجّعو لصفحة تسجيل الدخول
    redirect("/signin");
  }

  return user.id;
}

// ✅ جلب الطلبات من الـ API مع فلترة حسب user_id
async function fetchOrders(userId: string): Promise<DirectusOrder[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/orders?user_id=${encodeURIComponent(userId)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch orders", res.status, await res.text());
      return [];
    }

    const json = await res.json();

    // متوقع أن /api/orders ترجع شكل: { data: [...] }
    const data = Array.isArray(json.data) ? (json.data as DirectusOrder[]) : [];
    return data;
  } catch (err) {
    console.error("fetchOrders error", err);
    return [];
  }
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
}

function getStatusBadge(status: string) {
  const st = status?.toLowerCase?.() ?? "";

  if (st === "completed" || st === "paid" || st === "done") {
    return {
      label: "مكتمل",
      className:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-400/50",
    };
  }

  if (st === "cancelled" || st === "canceled" || st === "failed") {
    return {
      label: "ملغي",
      className:
        "bg-red-500/10 text-red-300 border border-red-400/50",
    };
  }

  // افتراضياً نعتبره قيد التنفيذ
  return {
    label: "قيد التنفيذ",
    className:
      "bg-amber-500/10 text-amber-300 border border-amber-400/50",
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // ✅ أول شي: نجيب user_id
  const userId = await getCurrentUserId();

  // ✅ بعدين: نجيب طلبات هالمستخدم بس
  const allOrders = await fetchOrders(userId);

  const statusFilter = searchParams?.status?.toLowerCase();
  const orders =
    statusFilter && statusFilter !== "all"
      ? allOrders.filter(
          (order) => order.status?.toLowerCase() === statusFilter
        )
      : allOrders;

  const totalOrders = allOrders.length;
  const pendingCount = allOrders.filter((order) => {
    const st = order.status?.toLowerCase?.() ?? "";
    return st === "pending" || st === "processing";
  }).length;
  const completedCount = allOrders.filter((order) => {
    const st = order.status?.toLowerCase?.() ?? "";
    return st === "completed" || st === "paid" || st === "done";
  }).length;

  return (
    <main
      className="min-h-screen pt-24 pb-16 text-white"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-4">طلبــاتــك</h1>

        {/* ملخّص سريع للطلبات */}
        <div className="mb-4 grid gap-3 text-xs sm:text-sm md:grid-cols-3">
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 flex flex-col gap-1">
            <span className="text-white/60">إجمالي الطلبات</span>
            <span className="text-lg font-semibold">{totalOrders}</span>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 flex flex-col gap-1">
            <span className="text-white/60">طلبات قيد التنفيذ</span>
            <span className="text-lg font-semibold text-amber-300">{pendingCount}</span>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 flex flex-col gap-1">
            <span className="text-white/60">الطلبات المكتملة</span>
            <span className="text-lg font-semibold text-emerald-300">{completedCount}</span>
          </div>
        </div>

        {/* شريط فلترة حسب الحالة */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          {[
            { value: "all", label: "الكل" },
            { value: "pending", label: "قيد التنفيذ" },
            { value: "completed", label: "مكتمل" },
            { value: "cancelled", label: "ملغي" },
          ].map((st) => {
            const isActive =
              !statusFilter && st.value === "all"
                ? true
                : statusFilter === st.value;

            const href =
              st.value === "all"
                ? "/account/orders"
                : `/account/orders?status=${st.value}`;

            return (
              <Link
                key={st.value}
                href={href}
                className={`px-3 py-1 rounded-full border text-xs transition ${
                  isActive
                    ? "bg-amber-400 text-black border-amber-400"
                    : "border-white/30 text-white/70 hover:bg-white/10"
                }`}
              >
                {st.label}
              </Link>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/15 bg-black/30 p-6 text-sm text-white/80 text-center flex flex-col items-center gap-3">
            <div className="text-3xl mb-1">🛒</div>
            <p>حالياً ما في أي طلبات مسجّلة إلك، أول ما تعمل طلب جديد رح يطلع هون 👌</p>
            <Link
              href="/"
              className="mt-1 inline-flex items-center rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-300 transition"
            >
              ابدأ التسوّق الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/15 bg-black/30 p-4 flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">طلب رقم #{order.id}</div>
                  <div className="text-xs text-white/60">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                <div className="text-sm text-white/80 flex flex-wrap gap-4">
                  <span>
                    الاسم:{" "}
                    <span className="font-medium">{order.customer_name}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm mt-1">
                  <span>
                    {(() => {
                      const badge = getStatusBadge(order.status || "");
                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      );
                    })()}
                  </span>
                  <span className="text-amber-300 font-bold">
                    {order.total.toLocaleString("ar-EG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-xs font-normal text-white/80">
                      {order.currency}
                    </span>
                  </span>
                </div>

                {order.payment_method && (
                  <div className="text-xs text-white/60">
                    طريقة الدفع:{" "}
                    <span className="font-medium">{order.payment_method}</span>
                  </div>
                )}

                {order.notes && (
                  <div className="text-xs text-white/70 mt-1">{order.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}