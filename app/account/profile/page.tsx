"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getBrowserSupabase from "@/lib/supabase-browser";

export default function AccountProfilePage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);

  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [lastSignInAt, setLastSignInAt] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // إجمالي الطلبات / الطلبات قيد التنفيذ (حالياً أرقام تجريبية – نربط Directus لاحقاً)
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);

  useEffect(() => {
    const supabase = getBrowserSupabase();

    let isMounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!isMounted) return;

      if (error || !data?.user) {
        // إذا ما في مستخدم، منرجّعه على صفحة تسجيل الدخول
        router.replace("/signin");
        setIsLoadingUser(false);
        return;
      }

      const user = data.user;

      setUserEmail(user.email ?? null);

      const metadata: any = user.user_metadata || {};

      // الاسم المعروض
      if (metadata.display_name) {
        setDisplayName(metadata.display_name as string);
      } else if (user.email) {
        // إذا ما في اسم محفوظ، مناخد الجزء اللي قبل @ من الإيميل
        setDisplayName(user.email.split("@")[0]);
      }

      // رقم الهاتف
      if (metadata.phone_number) {
        setPhoneNumber(metadata.phone_number as string);
      }

      // الدولة / المنطقة
      if (metadata.country) {
        setCountry(metadata.country as string);
      }

      // تنبيهات البريد
      if (typeof metadata.email_notifications === "boolean") {
        setEmailNotifications(metadata.email_notifications);
      }

      // تواريخ الحساب
      if (user.created_at) {
        setCreatedAt(formatDateTime(user.created_at));
      }
      // last_sign_in_at أحياناً بتكون موجودة بالـ metadata أو داخل user
      const lastSignIn =
        (metadata.last_sign_in_at as string | undefined) ||
        (user.last_sign_in_at as string | undefined) ||
        null;
      if (lastSignIn) {
        setLastSignInAt(formatDateTime(lastSignIn));
      }

      // مبدئياً منترك أرقام الطلبات 0 – لاحقاً منربطها مع Directus
      setIsLoadingUser(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  // جلب ملخّص الطلبات (إجمالي + قيد التنفيذ) من API داخلي
  useEffect(() => {
    // منستنى لنعرف إيميل المستخدم بالأول
    if (!userEmail) return;

    let isMounted = true;

    const loadOrderStats = async () => {
      try {
        const res = await fetch(
          `/api/orders/summary?email=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch orders summary", await res.text());
          return;
        }

        const json = await res.json();

        if (!isMounted) return;

        // نتوقع من الـ API يرجع شكل مثل: { total: number, pending: number }
        setTotalOrders(typeof json.total === "number" ? json.total : 0);
        setPendingOrders(typeof json.pending === "number" ? json.pending : 0);
      } catch (err) {
        console.error("Error loading order stats", err);
      }
    };

    loadOrderStats();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  // فورمات بسيط للتاريخ/الوقت بالإنكليزي
  function formatDateTime(value: string): string {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return value;
    }
  }

  const avatarInitial =
    (displayName?.charAt(0) || userEmail?.charAt(0) || "S").toUpperCase();

  const handleSaveProfile = async () => {
    if (!userEmail) return;

    const supabase = getBrowserSupabase();
    setIsSaving(true);
    setSaveMessage(null);

    const trimmedName = displayName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedCountry = country.trim();

    // تحقق بسيط على رقم الهاتف (اختياري)
    if (trimmedPhone && trimmedPhone.replace(/\D/g, "").length < 8) {
      setSaveMessage("⚠️ تأكد من كتابة رقم هاتف صحيح قبل الحفظ.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: trimmedName || null,
        phone_number: trimmedPhone || null,
        country: trimmedCountry || null,
        email_notifications: emailNotifications,
      },
    });

    if (error) {
      console.error(error);
      setSaveMessage("⚠️ صار خطأ أثناء حفظ بيانات الحساب. جرّب مرة تانية.");
    } else {
      setSaveMessage("✅ تمّ حفظ بيانات الحساب بنجاح.");
    }

    setIsSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!userEmail) {
      setResetMessage("⚠️ لازم تكون مسجّل دخول بإيميل صالح.");
      return;
    }

    const supabase = getBrowserSupabase();
    setIsSendingReset(true);
    setResetMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        // بعد ما تكبس على رابط الإيميل، رح يرجّعك على صفحة خاصة لتغيير كلمة السر
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error(error);
        setResetMessage("⚠️ ما قدرنا نبعت رابط تغيير كلمة السر. جرّب مرة تانية.");
      } else {
        setResetMessage(
          "✅ بعتنا لك إيميل فيه رابط لتغيير كلمة السر. بعد ما تكبس على الرابط رح تنتقل لصفحة خاصة لتعيين كلمة سر جديدة."
        );
      }
    } catch (err) {
      console.error(err);
      setResetMessage("⚠️ صار خطأ غير متوقع. جرّب لاحقاً.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/signin");
  };

  if (isLoadingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b0d] text-white" dir="rtl">
        <p className="text-sm text-white/70">جارٍ تحميل بيانات حسابك...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white bg-[#0b0b0d]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        {/* العنوان الأساسي */}
        <header className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1 text-xs text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            إعدادات الحساب
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-1">
              ملفّك الشخصي على <span className="text-amber-300">Shdaty</span>
            </h1>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[7fr,5fr] items-start">
          {/* القسم الرئيسي: بطاقة معلومات الحساب */}
          <section className="bg-black/30 rounded-2xl border border-white/10 p-6 lg:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur">
            {/* الصف العلوي: صورة + معلومات أساسية + أرقام سريعة */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
              {/* صورة الحساب والمعلومات الأساسية */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffb703] to-[#fb5607] flex items-center justify-center text-3xl font-bold shadow-xl border border-white/20">
                    {avatarInitial}
                  </div>
                  <span className="absolute -bottom-1 -left-1 rounded-full bg-emerald-500 text-[10px] px-2 py-0.5 border border-black/50">
                    فعّال
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/50">البريد الإلكتروني</p>
                  <p className="font-semibold text-sm sm:text-base truncate max-w-[260px]">
                    {userEmail ?? "player@example.com"}
                  </p>
                </div>
              </div>

            </div>

            <div className="border-t border-white/10 pt-6 grid gap-4 md:grid-cols-2 text-sm">
              {/* بيانات نصّية */}
              <div className="space-y-4">
                {/* حقل الاسم المعروض */}
                <div>
                  <p className="text-xs text-white/50 mb-1">الاسم المعروض</p>
                  <input
                    type="text"
                    dir="rtl"
                    className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-300 transition"
                    placeholder="اكتب الاسم اللي حابب يظهر بالحساب"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                {/* حقل رقم الهاتف */}
                <div>
                  <p className="text-xs text-white/50 mb-1">رقم الهاتف</p>
                  <input
                    type="tel"
                    dir="ltr"
                    className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-300 transition"
                    placeholder="+90 5xx xxx xx xx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-white/40">
                    رقمك بيساعدنا نتواصل معك أسرع في حال في ملاحظات على الطلب.
                  </p>
                </div>

                {/* الدولة / المنطقة */}
                <div>
                  <p className="text-xs text-white/50 mb-1">الدولة / المنطقة</p>
                  <select
                    className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-300 transition"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">غير محدّدة</option>
                    <option value="TR">تركيا</option>
                    <option value="SA">السعودية</option>
                    <option value="AE">الإمارات</option>
                    <option value="QA">قطر</option>
                    <option value="KW">الكويت</option>
                    <option value="JO">الأردن</option>
                    <option value="SY">سوريا</option>
                  </select>
                </div>
              </div>

              {/* حالة الحساب والتواريخ */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">حالة الحساب</p>
                  <p className="font-medium text-emerald-300">مفعّل</p>
                  <p className="mt-1 text-[11px] text-white/40">
                    الحساب جاهز لتنفيذ الطلبات والشحن بدون أي قيود.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/50 mb-1">تاريخ إنشاء الحساب</p>
                  <p className="font-medium">
                    {createdAt ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/50 mb-1">آخر تسجيل دخول</p>
                  <p className="font-medium">
                    {lastSignInAt ?? "—"}
                  </p>
                </div>

                {/* إعدادات التنبيهات البريدية */}
                <div>
                  <p className="text-xs text-white/50 mb-1">التنبيهات البريدية</p>
                  <button
                    type="button"
                    onClick={() => setEmailNotifications((prev) => !prev)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] border transition ${
                      emailNotifications
                        ? "bg-emerald-500/10 border-emerald-400 text-emerald-200"
                        : "bg-white/5 border-white/20 text-white/70"
                    }`}
                  >
                    <span>
                      {emailNotifications ? "مفعّلة حالياً" : "غير مفعّلة – كبس لتفعيلها"}
                    </span>
                  </button>
                  <p className="mt-1 text-[11px] text-white/40">
                    إذا فعّلتها، رح نستخدم الإيميل لنبعت لك تحديثات مهمّة عن طلباتك فقط.
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار سريعة أسفل الصفحة */}
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs hover:bg-white/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "جارٍ حفظ التعديلات..." : "حفظ بيانات الحساب"}
              </button>
              {saveMessage && (
                <p className="text-[11px] text-white/60 mt-1">
                  {saveMessage}
                </p>
              )}
            </div>
          </section>

          {/* القائمة الجانبية: أقسام الحساب */}
          <aside className="bg-black/35 rounded-2xl border border-white/10 p-5 lg:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur space-y-4 text-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-base">لوحة الحساب</h2>
              <span className="text-[11px] text-white/50">
                تحكّم سريع بكل أقسامك
              </span>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between rounded-xl bg-white/15 border border-amber-300/60 px-4 py-2.5 hover:bg-white/20 transition">
                <span className="font-medium">معلومات الحساب</span>
                <span className="text-[11px] text-amber-200">الصفحة الحالية</span>
              </button>

              <Link
                href="/account/orders"
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 hover:bg-white/10 transition"
              >
                <span>سجل الشراء</span>
                <span className="text-[11px] text-white/45">كل الطلبات السابقة</span>
              </Link>


              <button
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handlePasswordReset}
                disabled={isSendingReset}
              >
                <span>تعديل كلمة السر</span>
                <span className="text-[11px] text-white/45">
                  {isSendingReset
                    ? "جاري إرسال رابط التغيير..."
                    : "بعتلك رابط تغيير كلمة السر على الإيميل"}
                </span>
              </button>
              {resetMessage && (
                <p className="text-[11px] text-white/60 mt-1 pr-1">
                  {resetMessage}
                </p>
              )}

            </div>

            <div className="pt-2 border-t border-white/10 mt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between rounded-xl bg-red-500/10 border border-red-400/40 px-4 py-2.5 hover:bg-red-500/20 transition text-red-200"
              >
                <span>تسجيل الخروج</span>
                <span className="text-[11px] text-red-200/80">إنهاء الجلسة الحالية</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}