// app/page.tsx

export default function HomePage() {
  return (
    <main
      className="relative z-10 overflow-hidden text-white min-h-screen pt-24 md:pt-28 pb-16 flex flex-col items-center p-6"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100">
        <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25_217)" />
          <circle cx="18" cy="182" r="18" fill="url(#paint1_radial_25_217)" />
          <circle cx="77" cy="288" r="34" fill="url(#paint2_radial_25_217)" />
          <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear_25_217)" />
          <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" stroke="url(#paint4_linear_25_217)" />
          <circle opacity="0.8" cx="356" cy="290" r="179.5" transform="rotate(-30 356 290)" stroke="url(#paint5_linear_25_217)" />
          <circle opacity="0.8" cx="191.659" cy="302.659" r="133.362" transform="rotate(133.319 191.659 302.659)" fill="url(#paint6_linear_25_217)" />
          <defs>
            <linearGradient id="paint0_linear_25_217" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="paint1_radial_25_217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 182) rotate(90) scale(18)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="paint2_radial_25_217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(77 288) rotate(90) scale(34)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear_25_217" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear_25_217" x1="184.521" y1="182.159" x2="184.521" y2="448.882" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear_25_217" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear_25_217" x1="118.524" y1="29.2497" x2="166.965" y2="338.63" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="block md:hidden w-full mb-6 relative z-10">
        <img src="/images/character-shdosh.png" alt="character-shdosh" className="mx-auto h-[400px] opacity-80 pointer-events-none select-none" />
      </div>

      <div className="w-full lg:pl-[300px] mt-6 md:mt-10 relative z-10">
        <div className="mx-auto max-w-3xl bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">شروط الاستخدام</h1>

          <p className="text-white/85 leading-relaxed mb-6 text-justify">
            باستخدامك لموقع وخدمات <span className="font-semibold text-white">Shdaty</span> فإنك توافق على الشروط والأحكام التالية. يرجى قراءة البنود بعناية قبل المتابعة.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">١) الحساب والمسؤولية</h2>
          <ul className="list-disc pr-6 text-white/85 space-y-2">
            <li>أنت مسؤول عن سرية معلومات تسجيل الدخول إلى حسابك وعن جميع الأنشطة التي تتم من خلاله.</li>
            <li>يجب تقديم معلومات صحيحة ومحدّثة، وأي استخدام غير مصرح به يجب إبلاغنا به فورًا.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٢) الطلبات والدفع</h2>
          <ul className="list-disc pr-6 text-white/85 space-y-2">
            <li>قد تتغير الأسعار والعروض دون إشعار مسبق.</li>
            <li>تُنفّذ عمليات الدفع عبر مزودي دفع موثوقين، ولا نحتفظ ببيانات بطاقاتك على خوادمنا.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٣) الاسترجاع والدعم</h2>
          <p className="text-white/80 leading-8">
            تختلف سياسات الاسترجاع حسب نوع المنتج وطريقة الدفع. سنبذل جهدنا لمعالجة الطلبات بشكل عادل وفق سياساتنا المعلنة وقوانين المستهلك المطبّقة.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٤) الاستخدام المقبول</h2>
          <ul className="list-disc pr-6 text-white/85 space-y-2">
            <li>يُحظر إساءة استخدام الموقع أو محاولة اختراقه أو تعطيل خدماته.</li>
            <li>يُمنع استخدام الخدمة في أنشطة مخالفة للقانون أو تنتهك حقوق الآخرين.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٥) الملكية الفكرية</h2>
          <p className="text-white/80 leading-8">
            جميع العلامات التجارية والأصول المرئية والمواد المنشورة على الموقع مملوكة لأصحابها، وأي استخدام غير مصرح به محظور.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٦) إخلاء المسؤولية</h2>
          <p className="text-white/80 leading-8">
            تُقدّم الخدمات "كما هي" دون أي ضمانات صريحة أو ضمنية بخصوص الدقة أو التوفر الدائم. قد تتعرض الخدمات للصيانة أو الأعطال من وقت لآخر.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٧) التعديلات على الشروط</h2>
          <p className="text-white/80 leading-8">
            قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك في استخدام الخدمات بعد نشر التعديلات يُعد موافقة على النسخة المُحدّثة.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">٨) التواصل</h2>
          <p className="text-white/80 leading-8">
            لأي استفسار بخصوص هذه الشروط، تواصل معنا عبر البريد:
            <a href="mailto:terms@shdaty.example" className="underline decoration-dotted mx-1">terms@shdaty.example</a>
          </p>
        </div>
      </div>

      <div className="hidden lg:block absolute left-0 top-20 h-[60vh] z-0">
        <img src="/images/character-shdosh.png" alt="character-shdosh" className="h-full object-contain pointer-events-none select-none" />
      </div>
    </main>
  );
}