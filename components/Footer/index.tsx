"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer
        className="wow fadeInUp relative z-10 pt-16 md:pt-20 lg:pt-24 text-white"
        style={{
          background: "linear-gradient(to left, #41295a, #2F0743)"
        }}
        data-wow-delay=".1s"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 text-4xl drop-shadow-[0_0_12px_#facc15] animate-pulse">⚡</span>
<h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-100 via-yellow-1000 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,200,0,0.9)] tracking-wide">
                    Shdaty 
                  
                  </h1>                  </div>
                </Link>
                <h4 className="mb-4 text-lg font-semibold text-yellow-300 drop-shadow-[0_0_8px_#facc15]">لماذا الشحن عبر Shdaty؟</h4>
                <ul className="space-y-2 text-white/90 leading-relaxed">
                  <li>تسليم فوري للبطاقات والشدّات بعد الدفع.</li>
                  <li>أسعار منافسة وعروض دورية على أشهر الألعاب.</li>
                  <li>بوابات دفع متعددة وآمنة تناسب كل الدول.</li>
                </ul>
                <div className="mt-4">
                  <h4 className="mb-2 text-base font-semibold text-white">طرق الدفع المدعومة</h4>
                  <ul className="flex flex-wrap items-center gap-3">
                    <li className="flex items-center">
                      <img
                        src="/images/icons8-paypal-48.png"
                        alt="PayPal"
                        className="h-12 w-auto opacity-90 hover:opacity-100 hover:scale-105 transition"
                        loading="lazy"
                      />
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/images/visa.png"
                        alt="Visa"
                        className="h-12 w-auto opacity-90 hover:opacity-100 hover:scale-105 transition"
                        loading="lazy"
                      />
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/images/icons8-google-pay-24.png"
                        alt="Google Pay"
                        className="h-12 w-auto opacity-90 hover:opacity-100 hover:scale-105 transition"
                        loading="lazy"
                      />
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/images/round.png"
                        alt="Mastercard"
                        className="h-12 w-auto opacity-90 hover:opacity-100 hover:scale-105 transition"
                        loading="lazy"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h4 className="mb-4 text-lg font-semibold text-white">تابعنا</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-3 items-center">
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/instagram-new-2016-seeklogo.png"
      alt="Instagram"
      className="w-7 h-7 opacity-90 hover:opacity-100 hover:scale-110 transition"
    />
  </a>
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/icons8-facebook-logo-48.png"
      alt="Facebook"
      className="w-7 h-7 opacity-90 hover:opacity-100 hover:scale-110 transition"
    />
  </a>
  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/tiktok-app-icon-seeklogo.svg"
      alt="TikTok"
      className="w-7 h-7 opacity-90 hover:opacity-100 hover:scale-110 transition"
    />
  </a>
  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
    <img
      src="/images/icons8-telegram-logo-48.png"
      alt="TikTok"
      className="w-7 h-7 opacity-90 hover:opacity-100 hover:scale-110 transition"
    />
  </a>
</div>
                </div>
              </div>
            </div>


          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-8">
            <div className="grid gap-6 md:grid-cols-2">
              
              
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <div className="flex justify-center items-center gap-6 text-sm text-white/70">
                <Link href="/privacy" className="hover:text-orange-300 transition">سياسة الخصوصية</Link>
                <span className="text-white/30">•</span>
                <Link href="/terms" className="hover:text-orange-300 transition">شروط الاستخدام</Link>
                <span className="text-white/30">•</span>
                <Link href="/secure-payment" className="hover:text-orange-300 transition">الدفع الآمن</Link>
              </div>
              <p className="text-center text-xs text-white/40 mt-3">© 2025 <span className="text-orange-300 font-semibold">Shdaty</span> — جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-14 z-[-1]">
          <svg
            width="55"
            height="99"
            viewBox="0 0 55 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
            <mask
              id="mask0_94:899"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="99"
              height="99"
            >
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="#5B2A86"
              />
            </mask>
            <g mask="url(#mask0_94:899)">
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="url(#paint0_radial_94:899)"
              />
              <g opacity="0.8" filter="url(#filter0_f_94:899)">
                <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_94:899"
                x="12.4852"
                y="-15.1763"
                width="82.7646"
                height="82.7646"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10.5"
                  result="effect1_foregroundBlur_94:899"
                />
              </filter>
              <radialGradient
                id="paint0_radial_94:899"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
              >
                <stop stopOpacity="0.47" />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-24 left-0 z-[-1]">
          <svg
            width="79"
            height="94"
            viewBox="0 0 79 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              fill="url(#paint0_linear_94:889)"
            />
            <rect
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              stroke="url(#paint1_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
              fill="url(#paint2_linear_94:889)"
            />
            <path
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
              stroke="url(#paint3_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
              fill="url(#paint4_linear_94:889)"
            />
            <path
              d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
              stroke="url(#paint5_linear_94:889)"
              strokeWidth="0.7"
            />
            <defs>
              <linearGradient
                id="paint0_linear_94:889"
                x1="-41"
                y1="21.8445"
                x2="36.9671"
                y2="59.8878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0.62" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_94:889"
                x1="25.6675"
                y1="95.9631"
                x2="-42.9608"
                y2="20.668"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_94:889"
                x1="20.325"
                y1="-3.98039"
                x2="90.6248"
                y2="25.1062"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0.62" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_94:889"
                x1="18.3642"
                y1="-1.59742"
                x2="113.9"
                y2="80.6826"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_94:889"
                x1="61.1098"
                y1="62.3249"
                x2="-8.82468"
                y2="58.2156"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0.62" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_94:889"
                x1="65.4236"
                y1="65.0701"
                x2="24.0178"
                y2="41.6598"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5B2A86" stopOpacity="0" />
                <stop offset="1" stopColor="#5B2A86" stopOpacity="0.51" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;
