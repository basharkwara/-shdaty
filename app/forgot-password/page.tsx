"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setMsg("يرجى إدخال بريدك الإلكتروني.");
    setMsg("تم إرسال التعليمات إلى بريدك (واجهة فقط).");
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
              <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">نسيت كلمة المرور</h3>
              <p className="mb-8 text-center text-white/80">أدخل بريدك لإرسال رابط الاستعادة.</p>
              <form onSubmit={onSubmit}>
                <label className="mb-2 block text-sm" htmlFor="email">البريد الإلكتروني</label>
                <input
                  id="email"
                  type="email"
                  className="mb-4 w-full rounded-sm border border-transparent bg-[#2C303B] px-6 py-3 text-base outline-none focus:border-primary"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  autoComplete="email"
                />
                <button type="submit" className="w-full rounded-md bg-primary px-6 py-3 text-white">إرسال</button>
              </form>
              {msg && <p className="mt-4 text-center text-sm text-green-400">{msg}</p>}
              <p className="mt-6 text-center text-sm text-white/70">
                <Link className="underline hover:opacity-80" href="/signin">العودة لتسجيل الدخول</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}