"use client";
import { useState } from "react";
import Link from "next/link";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <section
        className="relative z-10 overflow-hidden min-h-screen pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]"
        style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded-xl px-6 py-10 sm:p-[60px] text-white backdrop-blur-xl bg-white/5 border border-white/10">
                <h3 className="mb-3 text-center text-2xl font-bold text-white sm:text-3xl">
                  أنشئ حسابك
                </h3>
                <p className="mb-11 text-center text-base font-medium text-white/80">
                  مجاني بالكامل وسهل جدًا
                </p>
                <a
                  href="/api/auth/signin/google"
                  className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary"
                >
                  <span className="mr-3">
                    (… SVG كود جوجل مثل ما هو …)
                  </span>
                  التسجيل باستخدام جوجل
                </a>

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-white/70">
                    أو سجّل باستخدام بريدك الإلكتروني
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!name || !email || !password) {
                      setError("جميع الحقول مطلوبة");
                      return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                      setError("يرجى إدخال بريد إلكتروني صالح");
                      return;
                    }
                    setError("");
                    console.log({ name, email, password }); // لاحقًا تُستبدل بطلب API
                  }}
                >
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="mb-6">
                    <button
                      type="submit"
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                    >
                      تسجيل
                    </button>
                  </div>
                </form>

                <p className="text-center text-base font-medium text-body-color">
                  لديك حساب بالفعل؟{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SVG الخلفية */}
      </section>
    </>
  );
};

export default SignupPage;