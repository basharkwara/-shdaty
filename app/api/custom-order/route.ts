import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Simple runtime validation without external deps
interface OrderItem { id?: string; sku?: string; name?: string; price: number; qty: number }
interface OrderPayload {
  customer_name: string;
  contact?: string;
  payment_method?: string;
  currency?: string; // ex: USD / TRY / ARS ...
  items: OrderItem[];
  total?: number; // calculated if not provided
  meta?: Record<string, any>;
}

function badRequest(message: string, details?: any) {
  return NextResponse.json(
    { ok: false, error: { message, details } },
    { status: 400 }
  );
}

function computeTotal(items: OrderItem[]): number {
  return Number(
    items.reduce((sum, i) => sum + Number(i.price ?? 0) * Number(i.qty ?? 0), 0)
      .toFixed(2)
  );
}

function validate(body: any): { ok: true; data: OrderPayload } | { ok: false; res: NextResponse } {
  if (!body || typeof body !== "object") {
    return { ok: false, res: badRequest("Body must be a JSON object") };
  }

  const { customer_name, items, contact, payment_method, currency, total, meta } = body;

  if (!customer_name || typeof customer_name !== "string") {
    return { ok: false, res: badRequest("customer_name is required and must be a string") };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, res: badRequest("items must be a non-empty array") };
  }

  for (const [idx, it] of items.entries()) {
    if (typeof it?.price !== "number" || typeof it?.qty !== "number") {
      return { ok: false, res: badRequest(`items[${idx}] must include numeric price and qty`) };
    }
  }

  const payload: OrderPayload = {
    customer_name,
    contact,
    payment_method,
    currency,
    items,
    total: typeof total === "number" ? total : computeTotal(items),
    meta,
  };

  return { ok: true, data: payload };
}

/**
 * GET /api/custom-order
 * Proxies to /api/orders and passes through the search params.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL("/api/orders", req.nextUrl);
    // preserve search params
    url.search = req.nextUrl.search;

    const r = await fetch(url.toString(), { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    return NextResponse.json(j, { status: r.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { message: "Failed to fetch orders", reason: String(err?.message || err) } },
      { status: 502 }
    );
  }
}

/**
 * POST /api/custom-order
 * Validates payload, computes total if missing, adds created_at snapshot,
 * forwards to /api/orders. Supports Idempotency-Key header passthrough.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => null);

    // Normalize number-like values in items just in case they arrive as strings
    if (raw?.items && Array.isArray(raw.items)) {
      raw.items = raw.items.map((it: any) => ({
        ...it,
        price: typeof it?.price === "string" ? Number(it.price) : it?.price,
        qty: typeof it?.qty === "string" ? Number(it.qty) : it?.qty,
      }));
    }

    const v = validate(raw);
    if (!("ok" in v && v.ok)) return v.res;

    // construct payload (aligned with Directus collection fields)
    const bodyToCreate = {
      ...v.data,
      created_at: new Date().toISOString(),
      status: (raw?.status as string) || "pending",
    };

    const target = new URL("/api/orders", req.nextUrl).toString();

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const idem = req.headers.get("idempotency-key");
    if (idem) headers["Idempotency-Key"] = idem;

    const upstream = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyToCreate),
    });

    // Try to capture the upstream response (json or text) for easier debugging
    const contentType = upstream.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await upstream.json().catch(() => ({}))
      : await upstream.text().catch(() => "");

    // If upstream failed, bubble up the details so we can see the exact Directus/route error
    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: "Upstream /api/orders rejected the payload",
            status: upstream.status,
            statusText: upstream.statusText,
            upstream: payload,
            sent: bodyToCreate,
          },
        },
        { status: upstream.status }
      );
    }

    // Success passthrough
    return NextResponse.json(
      typeof payload === "string" ? { ok: true, data: payload } : payload,
      { status: upstream.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { message: "Failed to create order", reason: String(err?.message || err) } },
      { status: 502 }
    );
  }
}