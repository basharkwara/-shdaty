// lib/noco.ts
import "server-only";

// Directus only (temporary while we finalize permissions/sort)
const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export type Category = {
  slug: string;
  name: string;
  image?: string | null;
  sort?: number;
};

export type Product = {
  id: number | string;
  name?: string;
  title?: string;
  slug: string;
  image?: any;
  image_url?: string | null;
  price?: number | null;
};

// Build Directus assets URL from UUID
const ASSETS_BASE = (process.env.NEXT_PUBLIC_DIRECTUS_ASSETS || DIRECTUS_URL).replace(/\/+$/, "");
function assetUrl(id?: string | null): string | null {
  if (!id) return null;
  return `${ASSETS_BASE}/assets/${id}`;
}

// Minimal helper for headers
function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (DIRECTUS_TOKEN && DIRECTUS_TOKEN.trim() !== "") {
    h["Authorization"] = `Bearer ${DIRECTUS_TOKEN}`;
  }
  return h;
}

// Internal fetch helper with error handling
async function dx(path: string, init?: RequestInit) {
  const url = `${DIRECTUS_URL}${path}`;
  const res = await fetch(url, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    cache: "no-store",
    next: { revalidate: 0 },
    ...(init || {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * جلب الفئات من Directus بدون sort لتفادي خطأ الصلاحيات على الحقل.
 * إذا بدك ترجع الترتيب لاحقًا، أضف field وامنحه صلاحيات القراءة ثم أعد تفعيل sort في الURL.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const fields = ["slug", "name", "image"].join(",");
  const url = `${DIRECTUS_URL}/items/categories?fields=${fields}&limit=100`;

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

  // تأكد من الشكل الذي يتوقعه الـ Hero: { slug, name(title), image(image_url) }
  return data.map((r: any) => {
    return {
      slug: r.slug,
      name: r.name,
      image: r.image, // نستخدم الـ UUID القادم من Directus
      sort: r.sort,
    };
  });
}

/**
 * إحضار فئة واحدة عبر الـ slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!slug || !slug.trim()) return null;
  const fields = ["slug", "name", "image", "sort"].join(",");
  const json = await dx(`/items/categories?fields=${fields}&limit=1&filter[slug][_eq]=${encodeURIComponent(slug)}`);
  const data = Array.isArray(json?.data) ? json.data : [];
  const row = data[0];
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    image: row.image ?? null,
    sort: row.sort,
  };
}

/**
 * جلب المنتجات حسب فئة الـ slug. متوافق مع مكوّن ProductGrid لديك (حقول مزدوجة للاسم والصورة).
 * يحاول أولاً عبر علاقة category.slug؛ إذا فشل بسبب إعداد الحقول، يسقط لطريقة أبسط (بدون فلترة الحالة).
 */
export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  if (!slug || !slug.trim()) return [];

  // 1) تأكيد وجود الفئة (اختياري لكنه مفيد)
  const cat = await getCategoryBySlug(slug);
  if (!cat) return [];

  // 2) الحقول المطلوبة من المنتجات
  const fields = [
    "id",
    "name",
    "title",
    "slug",
    "image",
    "price",
    // نجلب slug الفئة فقط إن كانت العلاقة مفعّلة، ولو لم تكن متاحة لا تتسبب بفشل الطلب
    "category.slug",
  ].join(",");

  // 3) محاولة الجلب مع فلترة العلاقة category.slug
  try {
    const json = await dx(
      `/items/products?fields=${fields}&limit=100&filter[category][slug][_eq]=${encodeURIComponent(slug)}`
    );
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map((r: any) => ({
      id: r.id,
      name: r.name ?? r.title ?? "منتج",
      title: r.title ?? r.name ?? null,
      slug: r.slug,
      image: r.image ?? null,
      image_url: assetUrl(r?.image),
      price: typeof r.price === "number" ? r.price : null,
    }));
  } catch (_) {
    // 4) سقوط لطريقة أبسط: بدون فلترة على العلاقة (تفيد لو عندك حقل category_id بدلاً من علاقة اسمية)
    const json = await dx(`/items/products?fields=${fields}&limit=100`);
    const list = Array.isArray(json?.data) ? json.data : [];
    // نرشّح بالـ slug يدويًا إذا كان متاحًا ضمن r.category?.slug
    const filtered = list.filter((r: any) => r?.category?.slug === slug);
    return filtered.map((r: any) => ({
      id: r.id,
      name: r.name ?? r.title ?? "منتج",
      title: r.title ?? r.name ?? null,
      slug: r.slug,
      image: r.image ?? null,
      image_url: assetUrl(r?.image),
      price: typeof r.price === "number" ? r.price : null,
    }));
  }
}