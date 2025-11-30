import Link from "next/link";

const DIRECTUS = (process.env.NEXT_PUBLIC_DIRECTUS || "http://localhost:8055").replace(/\/$/, "");

// نستخدم مخطط بسيط ومتوافق مع الإعداد الحالي: علاقة واحدة فقط باسم category
// (لو أردت دعم أشكال أخرى لاحقًا نضيفها بعد التأكد من وجود الحقول في الداتا مودل)

type Product = {
  id: number;
  name: string;
  slug: string;
  image?: string | null; // UUID من Directus
  category?: { slug?: string } | null;
};

async function getProducts(): Promise<Product[]> {
  // نطلب فقط الحقول الموجودة حالياً كي لا يرجع Directus خطأ FORBIDDEN عند طلب حقول غير موجودة
  const fields = ["id", "name", "slug", "image", "category.slug"].join(",");

  // فلترة على slug للفئة المرتبطة عبر الحقل category
  const url =
    `${DIRECTUS}/items/products` +
    `?fields=${encodeURIComponent(fields)}` +
    `&filter[category][slug][_eq]=tv` +
    `&sort=name&limit=-1`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Directus products fetch failed:", res.status, res.statusText);
    return [];
  }

  const json = await res.json();
  if (!Array.isArray(json?.data)) {
    console.error("Unexpected Directus response:", json);
    return [];
  }

  return json.data as Product[];
}

const getImg = (p: Product) => {
  const id = p?.image || "";
  if (id) return `${DIRECTUS}/assets/${id}?width=400&height=400&fit=cover`;
  return "/images/ue.png"; // شعار افتراضي
};

export default async function TvPage() {
  const products = await getProducts();

  return (
    <section
      className="relative z-10 overflow-hidden text-white min-h-screen pt-[120px] pb-16"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      <img
        src="/images/tvv.png"
        alt="TV Illustration"
        className="absolute left-0 top-10 h-[500px] w-auto opacity-90 pointer-events-none select-none hidden lg:block"
      />
      <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
          <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)" />
          <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_25:217)" />
          <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear_25:217)" />
          <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" stroke="url(#paint4_linear_25:217)" />
          <circle opacity="0.8" cx="356" cy="290" r="179.5" transform="rotate(-30 356 290)" stroke="url(#paint5_linear_25:217)" />
          <circle opacity="0.8" cx="191.659" cy="302.659" r="133.362" transform="rotate(133.319 191.659 302.659)" fill="url(#paint6_linear_25:217)" />
          <defs>
            <linearGradient id="paint0_linear_25:217" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="paint1_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9997 182) rotate(90) scale(18)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="paint2_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76.9997 288) rotate(90) scale(34)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear_25:217" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear_25:217" x1="184.521" y1="182.159" x2="184.521" y2="448.882" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear_25:217" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear_25:217" x1="118.524" y1="29.2497" x2="166.965" y2="338.63" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        {products.length === 0 && (
          <div className="mt-8 rounded-xl bg-white/10 p-6 text-white/90">
            لا توجد عناصر لقسم التلفزيون حالياً. تأكّد من ربط المنتج بفئة slugها <b>tv</b> ومن صلاحيات القراءة.
          </div>
        )}

        <div className="wow fadeInUp mx-auto max-w-[800px] text-center" data-wow-delay=".2s">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {products.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} title={p.name} className="relative rounded-xl overflow-hidden shadow-md transition shadow-lg shadow-yellow-500/30">
                <div className="p-[3px] rounded-xl bg-gradient-to-br from-red-600 to-yellow-400">
                  <div className="backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl border border-transparent transition-transform duration-300 transform hover:-translate-y-2">
                    <img src={getImg(p)} alt={p.name} className="w-full aspect-square object-cover rounded-t-xl" />
                    <div className="p-6 text-center text-white">
                      <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}