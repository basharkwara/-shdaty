"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getBrowserSupabase from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"" | "success" | "error">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // عند فتح الرابط من الإيميل، Supabase بيرسل access_token و refresh_token بالـ hash
  // منثبت الجلسة محلياً لحتّى يقدر updateUser يغيّر كلمة السر.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    const supabase = getBrowserSupabase();

    supabase.auth
      .setSession({ access_token, refresh_token })
      .catch(() => {
        setMsg("رابط غير صالح أو منتهي، يرجى طلب رابط جديد من صفحة تسجيل الدخول.");
        setMsgType("error");
      });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMsg("");
    setMsgType("");

    if (!pw || !pw2) {
      setMsg("يرجى تعبئة الحقول.");
      setMsgType("error");
      return;
    }

    if (pw.length < 6) {
      setMsg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      setMsgType("error");
      return;
    }

    if (pw !== pw2) {
      setMsg("كلمتا المرور غير متطابقتين.");
      setMsgType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.updateUser({ password: pw });

      if (error) {
        console.error("reset-password error", error);
        setMsg("حدث خطأ أثناء تغيير كلمة المرور، حاول مرة أخرى أو اطلب رابطاً جديداً.");
        setMsgType("error");
        return;
      }

      setMsg("تم تغيير كلمة المرور بنجاح ✔️ يمكنك الآن تسجيل الدخول بكلمتك الجديدة.");
      setMsgType("success");

      // بعد ثواني بسيطة نرجّع المستخدم لتسجيل الدخول
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative z-10 overflow-hidden min-h-screen pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px] text-white"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded-xl px-6 py-10 sm:p-[60px] text-white backdrop-blur-xl bg-white/5 border border-white/10">
              <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
                إعادة تعيين كلمة المرور
              </h3>
              <p className="mb-6 text-center text-sm text-white/70">
                أدخل كلمة مرور جديدة قوية، وتأكد من حفظها بمكان آمن.
              </p>
              {msg && (
                <div
                  className={`mb-4 text-center text-sm rounded-md border px-4 py-2 ${
                    msgType === "success"
                      ? "bg-green-500/10 border-green-400/50 text-green-300"
                      : "bg-red-500/10 border-red-400/50 text-red-300"
                  }`}
                >
                  {msg}
                </div>
              )}
              <form onSubmit={onSubmit}>
                <label className="mb-2 block text-sm" htmlFor="pw">
                  كلمة المرور الجديدة
                </label>
                <input
                  id="pw"
                  type="password"
                  className="mb-4 w-full rounded-sm border border-transparent bg-[#2C303B] px-6 py-3 text-base outline-none focus:border-primary"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoComplete="new-password"
                />
                <label className="mb-2 block text-sm" htmlFor="pw2">
                  تأكيد كلمة المرور
                </label>
                <input
                  id="pw2"
                  type="password"
                  className="mb-6 w-full rounded-sm border border-transparent bg-[#2C303B] px-6 py-3 text-base outline-none focus:border-primary"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-primary px-6 py-3 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جارِ التغيير..." : "تغيير"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-white/70">
                <Link className="underline hover:opacity-80" href="/signin">
                  العودة لتسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}