"use client";

import { useEffect, useState } from "react";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { SessionProvider } from "next-auth/react"; // ✅ جديد

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Animated greeting on first visit per session
  const [showHello, setShowHello] = useState(false);
  useEffect(() => {
    const k = "shdaty_hello_shown";
    // Allow forcing the hello via query param ?hello=1
    let forced = false;
    try {
      const qp = new URLSearchParams(window.location.search);
      if (qp.get("hello") === "1") forced = true;
    } catch {}
    try {
      const shouldShow = forced || !sessionStorage.getItem(k);
      if (shouldShow) {
        setShowHello(true);
        sessionStorage.setItem(k, "1");
        const t = setTimeout(() => setShowHello(false), 3800);
        return () => clearTimeout(t);
      }
    } catch {
      // If sessionStorage blocked, still show once
      setShowHello(true);
      const t = setTimeout(() => setShowHello(false), 3800);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <html suppressHydrationWarning lang="ar" dir="rtl">
      <head />
      <body className={`${inter.className}`}>
        <Providers>
          <SessionProvider> {/* ✅ جديد: لفّ كل المحتوى بـ SessionProvider */}
            <Header />
            {children}
            <Footer />
            <ScrollToTop />

            {/* Chatbot Section */}
            <div
              className="fixed bottom-6 right-6 z-[999] group cursor-pointer select-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* Greeting bubble on first visit */}
              {showHello && (
                <div className="absolute -top-14 right-0 bg-white/95 text-gray-900 text-sm font-semibold py-2 px-3 rounded-xl shadow-xl animate-hello">
                  أهلين باللاعب الأسطوري 🎮
                  <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white/95 rotate-45"></div>
                </div>
              )}

              {/* Character */}
              <img
                src="/images/shddo.png"
                alt="Didosh"
                className={`w-28 h-28 md:w-32 md:h-32 rounded-full transition-all duration-500 hover:scale-110 hover:brightness-110 ${showHello ? "animate-wave" : "animate-bounce"}`}
              />
            </div>

            {/* Chatbot Popup */}
            {isOpen && (
              <div className="fixed bottom-6 right-6 z-[200]">
                <QuickChat onClose={() => setIsOpen(false)} />
              </div>
            )}
            <style jsx global>{`
              @keyframes helloIn {
                from { opacity: 0; transform: translateY(8px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-hello {
                animation: helloIn 320ms ease-out both;
              }
              @keyframes wave {
                0% { transform: rotate(0deg) }
                20% { transform: rotate(-10deg) }
                40% { transform: rotate  (8deg) }
                60% { transform: rotate(-6deg) }
                80% { transform: rotate(4deg) }
                100% { transform: rotate(0deg) }
              }
              .animate-wave {
                animation: wave 1s ease-in-out 0s 2;
              }
            `}</style>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

type ChatMsg = { role: "user" | "assistant"; text: string };

function normalizeArabic(s: string) {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0600-\u06FF0-9a-z\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cannedReply(q: string) {
  const t = normalizeArabic(q);
  const has = (...ws: string[]) => ws.some((w) => t.includes(normalizeArabic(w)));

  if (has("دفع", "طرق الدفع", "payment", "pay", "بطاقه", "فيزا", "ماستركارد"))
    return "طرق الدفع المتاحة: فيزا / ماستركارد / باي بال / Google Pay. جميع المعاملات مؤمنة.";

  if (has("تتبع", "وين طلبي", "حالة الطلب", "رقم الطلب", "order", "track")) {
    const m = q.match(/\b(ORD[-_ ]?\d{4,}|\d{6,})\b/i);
    if (m) return `رقم طلبك ${m[0]}، تقدر تتابع حالته من (حسابي → طلباتي). إذا تحب أني أتأكد لك—ابعث بريد الطلب.`;
    return "لتتبّع طلبك زودنا برقم الطلب أو البريد المستخدم بالحجز وسنتابع لك الحالة.";
  }

  if (has("ارجاع", "استرجاع", "refund"))
    return "طلبات الإرجاع تُراجع حسب الحالة ونوع الخدمة. راسلنا خلال 24 ساعة من الشراء لتسريع الإجراء.";

  if (has("سعر", "اسعار", "price", "كم", "تكلفه"))
    return "الأسعار موجودة داخل صفحات المنتجات وبالعملة اللي تختارها من أعلى الموقع. اذكر اسم المنتج لو بدك الدقّة.";

  if (has("تواصل", "دعم", "support", "اتصال", "واتساب", "تيليغرام"))
    return "للتواصل السريع: بريد الدعم support@shdaty.example أو تيليغرام @shdaty_support. نحن بالخدمة.";

  if (has("عرض", "عروض", "خصم", "كوبون", "coupon"))
    return "تفقد صفحة العروض الحالية. عند توفر كوبونات راح تلاقيها معلنة في الهيدر.";

  if (has("شروط", "خصوصيه", "دفع امن", "سياسة"))
    return "راجع صفحات: سياسة الخصوصية، شروط الاستخدام، والدفع الآمن من الروابط أسفل الموقع.";

  // مزحة خفيفة/شخصية شدوش
  if (has("ملل", "زهقان"))
    return "شكلّك محتاج صفقة 🔥 شو رأيك أطلع لك أفضل عرض اليوم؟";

  return "أنا شدوش لمساعدة أمور الموقع فقط (الدفع، الطلبات، الأسعار، السياسات). إذا عندك سؤال محدد قلّي عليه وأنا حاضر 😉";
}

function QuickChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", text: "👋 أهلًا! أنا شدوش. كيف فيني أساعدك اليوم؟ اختر من الاقتراحات أو اكتب سؤالك بالأسفل." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = ["كيفية الدفع؟", "تواصل معنا", "العروض الحالية"];

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: content }]);
    setLoading(true);
    // محاكاة كتابة قصيرة
    await new Promise((r) => setTimeout(r, 450));
    const reply = cannedReply(content);
    setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    setLoading(false);
  }

  return (
    <div className="relative w-[90vw] max-w-[380px] md:max-w-[420px] h-[70vh] max-h-[560px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-white/80 backdrop-blur-xl">
      {/* Header */}
      <div className="bg-gradient-to-l from-fuchsia-600 to-violet-700 text-white px-4 py-3 flex items-center gap-3">
        <img
          src="/images/shddo.png"
          alt="شدوش"
          className="w-8 h-8 rounded-full ring-2 ring-white/50 object-cover"
        />
        <div className="flex-1">
          <p className="font-bold leading-5">شدوش</p>
          <p className="text-[11px] opacity-90 -mt-0.5">{loading ? "يكتب الآن…" : "المجيب الترفيهي — متصل الآن"}</p>
        </div>
        <button
          onClick={onClose}
          className="grid place-items-center size-8 rounded-full hover:bg-white/15 transition"
          aria-label="إغلاق الدردشة"
          title="إغلاق"
        >
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-3 h-[calc(100%-56px-64px)] overflow-y-auto" dir="rtl">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}>
            {m.role === "assistant" && (
              <img src="/images/shddo.png" alt="" className="w-7 h-7 rounded-full ring-1 ring-black/5 object-cover" />
            )}
            <div
              className={`px-3 py-2 rounded-2xl text-sm shadow max-w-[80%] break-words ${
                m.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-md"
                  : "bg-white text-gray-800 rounded-tl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]"></span>
            <span className="ml-1">يكتب الآن…</span>
          </div>
        )}

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestions.map((t) =>
            t === "تواصل معنا" ? (
              <a
                key={t}
                href="https://wa.me/qr/2NQDPDOA3G6MG1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition inline-block"
              >
                {t}
              </a>
            ) : (
              <button
                key={t}
                onClick={() => send(t)}
                className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 px-3 py-1 rounded-full transition"
                type="button"
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-black/10 p-3 flex items-center gap-2 bg-white/70">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          type="text"
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          aria-label="حقل كتابة الرسالة"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          type="button"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}