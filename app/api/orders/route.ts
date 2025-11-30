import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN!;

// ✅ جلب الطلبات من Directus
// في حال أُرسل user_id عبر كويري، نرجّع طلبات هذا المستخدم فقط
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    const filter = userId
      ? `?filter[user_id][_eq]=${encodeURIComponent(userId)}`
      : "";

    const res = await fetch(`${DIRECTUS_URL}/items/orders${filter}`, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "GET failed" },
      { status: 500 }
    );
  }
}

// ✅ إنشاء طلب جديد في Directus
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // نتأكد إنو user_id موجود ضمن البيانات القادمة من الفرونت
    const { user_id, ...rest } = body;

    if (!user_id) {
      return NextResponse.json(
        { ok: false, error: "user_id is required" },
        { status: 400 }
      );
    }

    const created_at = new Date().toISOString();

    const order = {
      ...rest,
      user_id,
      created_at,
    };

    const res = await fetch(`${DIRECTUS_URL}/items/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(order),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "POST failed" },
      { status: 500 }
    );
  }
}