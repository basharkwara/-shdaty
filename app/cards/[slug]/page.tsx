// app/cards/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getCategoryBySlug, getProductsByCategorySlug } from "@/lib/noco";

type Props = { params: { slug: string } };

export default async function CardsBySlugPage({ params }: Props) {
  const { slug } = params;

  // جلب بيانات الفئة
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  // جلب منتجات/كروت هذه الفئة
  const products = await getProductsByCategorySlug(slug);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {category?.name ?? "الكروت الرقمية"}
      </h1>

      <ProductGrid products={products} />
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const cat = await getCategoryBySlug(params.slug);
  const title = cat?.name ? `${cat.name} — شدّاتي` : "الكروت الرقمية — شدّاتي";
  const description = cat?.name
    ? `تصفّح بطاقات ${cat.name} بأفضل الأسعار عبر Shdaty.`
    : "تصفّح جميع الكروت الرقمية عبر Shdaty.";
  return { title, description };
}

export const revalidate = 60;