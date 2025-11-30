import { redirect } from "next/navigation";

const routeMap: Record<string, string> = {
  games: "/games",
  apps: "/apps",
  tv: "/tv",
  "pubg-global": "/pubg-global",
  "free-fire": "/free-fire",
  // أضف أي slugs أخرى مطلوبة
};

const DEFAULT_REDIRECT = "/";

function normalizeSlug(slug: string): string {
  const decoded = decodeURIComponent(slug).trim();
  return decoded;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const raw = params.slug ?? "";
  const decoded = normalizeSlug(raw);
  const lower = decoded.toLowerCase();
  const kebab = lower.replace(/\s+/g, "-");

  // حاول أولاً بالماب
  if (routeMap[lower]) {
    return redirect(routeMap[lower]);
  }
  if (routeMap[decoded]) {
    return redirect(routeMap[decoded]);
  }
  if (routeMap[kebab]) {
    return redirect(routeMap[kebab]);
  }

  // جرّب مباشرة بنفس النصوص
  if (decoded) {
    return redirect(`/${decoded}`);
  }
  if (lower) {
    return redirect(`/${lower}`);
  }
  if (kebab) {
    return redirect(`/${kebab}`);
  }

  console.warn("[category/[slug]] لا يوجد مسار معروف لهذا السلوغ:", decoded);
  return redirect(DEFAULT_REDIRECT);
}