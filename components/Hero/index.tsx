import Image from "next/image";
import Link from "next/link";

// --- Directus fetching (server-side) ---
const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").trim();
const DIRECTUS_TOKEN = (process.env.DIRECTUS_TOKEN || process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || "").trim();

type Category = {
  slug: string;
  name: string;
  image_url?: string | null;
};

function getDirectusBase(): string {
  const base = DIRECTUS_URL.replace(/\/+$/, "");
  if (!base) {
    throw new Error(
      "Missing DIRECTUS_URL (or NEXT_PUBLIC_DIRECTUS_URL). Add it to your .env.local, e.g. DIRECTUS_URL=\"http://localhost:8055\""
    );
  }
  return base;
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (DIRECTUS_TOKEN) {
    h["Authorization"] = `Bearer ${DIRECTUS_TOKEN}`;
  }
  return h;
}

function toAbsoluteAsset(base: string, maybe: string | null | undefined) {
  const u = (maybe || "").trim();
  if (!u) return "/images/cards/placeholder.png";
  return u.startsWith("/") ? `${base}${u}` : u;
}

async function getActiveCategories(): Promise<Category[]> {
  const base = getDirectusBase();
  const fields = ["slug", "name", "image.id"].join(",");

  const url = `${base}/items/categories?fields=${fields}&limit=100`;

  const res = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
    next: { revalidate: 0, tags: ["categories"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const data = Array.isArray(json?.data) ? json.data : [];

  // تنظيف + صورة بديلة + ترتيب أبجدي عربي
  return data
    .map((r: any) => {
      const image = r?.image?.id ? `${base}/assets/${r.image.id}` : "/images/cards/placeholder.png";
      return {
        slug: r.slug,
        name: r.name,
        image_url: image,
      } as Category;
    })
    .filter((r: Category) => !!r.slug && !!r.name)
    .sort((a: Category, b: Category) =>
      String(a.name || "").localeCompare(String(b.name || ""), "ar")
    );
}

// --- UI ---

export default async function Hero() {
  let categories: Category[] = [];
  try {
    categories = await getActiveCategories();
  } catch (e: any) {
    // Graceful fallback: show setup hint instead of crashing
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 text-white">
        <h1 className="text-2xl font-bold">إعداد الاتصال مع Directus</h1>
        <p className="mt-3 text-white/80">
          {e?.message || "تعذّر الاتصال بقاعدة البيانات."}
        </p>
        <pre className="mt-4 rounded-lg bg-black/40 p-4 text-xs">
{`أضف القيم التالية إلى ملف .env.local ثم أعد التشغيل:
DIRECTUS_URL="http://localhost:8055"
# (اختياري) لو كنت تستخدم توكن ثابت:
DIRECTUS_TOKEN="<your-static-token>"`}
        </pre>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 pb-12">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white"></h1>
        <p className="mt-2 text-sm text-white/70"></p>
      </header>

  <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-2 gap-8 md:grid-cols-3">
    {categories.map((c) => (
      <Link key={c.slug} href={`/category/${encodeURIComponent(c.slug)}`} title={c.name}>
        <div className="relative rounded-xl overflow-hidden shadow-lg shadow-yellow-500/30 transition">
          <div className="p-[3px] rounded-xl bg-gradient-to-br from-red-600 to-yellow-400">
            <div className="backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl border border-transparent transition-transform duration-300 transform hover:-translate-y-2">
              <Image
                src={c.image_url || "/images/cards/placeholder.png"}
                alt={c.name}
                width={400}
                height={400}
                className="w-full aspect-square object-contain p-4 rounded-t-xl"
                priority={false}
              />
              <div className="p-4 text-center">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                  {c.name}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
    </section>
  );
}