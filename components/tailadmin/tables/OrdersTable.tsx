"use client";

import React, { useEffect, useMemo, useState } from "react";

type Order = {
  id?: string;           // uuid في supabase
  order_id?: string;     // مثل ORD-275077
  sku?: string;
  name?: string;
  price?: number;
  qty?: number;
  total?: number;
  customerKey?: string | null;
  method?: string | null;
  created_at?: string;   // تاريخ الإدخال
};

type SortKey =
  | "created_at"
  | "order_id"
  | "sku"
  | "name"
  | "price"
  | "qty"
  | "total"
  | "method"
  | "customerKey";

export default function OrdersTable() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Controls
  const [search, setSearch] = useState("");
  const [skuFilter, setSkuFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErr(null);
      const r = await fetch("/api/orders", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to load");
      // يدعم شكلَي الاستجابة: {orders:[...]} أو مصفوفة مباشرة
      const data: Order[] = Array.isArray(j) ? j : j.orders ?? [];
      setRows(data);
    } catch (e: any) {
      console.error("OrdersTable error:", e);
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Distinct lists for filters
  const skuOptions = useMemo(() => {
    const s = Array.from(new Set(rows.map((r) => r.sku).filter(Boolean))) as string[];
    return s.sort();
  }, [rows]);

  const methodOptions = useMemo(() => {
    const s = Array.from(new Set(rows.map((r) => r.method).filter(Boolean))) as string[];
    return s.sort();
  }, [rows]);

  // Derived rows: search + filter + sort
  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      const bySku = skuFilter === "all" || r.sku === skuFilter;
      const byMethod = methodFilter === "all" || r.method === methodFilter;
      const bySearch =
        !q ||
        [r.order_id, r.sku, r.name, r.customerKey, r.method]
          .map((v) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(q));
      return bySku && byMethod && bySearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];

      // numeric sort for numbers
      const numA = typeof va === "number" ? va : Number(va ?? 0);
      const numB = typeof vb === "number" ? vb : Number(vb ?? 0);

      if (["price", "qty", "total"].includes(sortKey)) {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }

      // date sort
      if (sortKey === "created_at") {
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return sortDir === "asc" ? da - db : db - da;
      }

      // string sort
      const sa = String(va ?? "").toLowerCase();
      const sb = String(vb ?? "").toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, search, skuFilter, methodFilter, sortKey, sortDir]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortButton: React.FC<{ label: string; k: SortKey }> = ({ label, k }) => (
    <button
      type="button"
      onClick={() => onSort(k)}
      className="inline-flex items-center gap-1 hover:underline"
      title="اضغط للفرز"
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">
        {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );

  const onExportCSV = () => {
    const header = [
      "Order ID",
      "SKU",
      "Name",
      "Price",
      "Qty",
      "Total",
      "Customer",
      "Method",
      "Created",
    ];
    const lines = displayed.map((o) => [
      o.order_id ?? "",
      o.sku ?? "",
      o.name ?? "",
      Number(o.price ?? 0),
      Number(o.qty ?? 0),
      Number(o.total ?? (o.price ?? 0)),
      (o.customerKey ?? "").replace(/[\r\n]+/g, " "),
      o.method ?? "",
      o.created_at ? new Date(o.created_at).toISOString() : "",
    ]);

    const csv =
      header.join(",") +
      "\n" +
      lines
        .map((row) =>
          row
            .map((v) => {
              const s = String(v ?? "");
              // escape CSV
              if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
              return s;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6">جارِ التحميل…</div>;
  if (err) return <div className="p-6 text-red-500">خطأ: {err}</div>;
  if (!rows.length)
    return (
      <div className="p-6 flex items-center justify-between gap-3">
        <div>لا توجد طلبات بعد.</div>
        <button
          onClick={fetchOrders}
          className="rounded bg-gray-900 text-white px-3 py-1.5 text-sm dark:bg-white dark:text-gray-900"
        >
          تحديث
        </button>
      </div>
    );

  return (
    <div className="w-full space-y-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث… (Order ID / SKU / Name / Customer / Method)"
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 w-60"
        />
        <select
          value={skuFilter}
          onChange={(e) => setSkuFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <option value="all">كل الـ SKU</option>
          {skuOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <option value="all">كل وسائل الدفع</option>
          {methodOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="rounded bg-gray-900 text-white px-3 py-2 text-sm dark:bg-white dark:text-gray-900"
            title="تحديث البيانات"
          >
            تحديث
          </button>
          <button
            onClick={onExportCSV}
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm"
            title="تصدير CSV"
          >
            تصدير CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-[920px] w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="text-left text-sm">
              <th className="px-4 py-3"><SortButton label="Created" k="created_at" /></th>
              <th className="px-4 py-3"><SortButton label="Method" k="method" /></th>
              <th className="px-4 py-3"><SortButton label="Customer" k="customerKey" /></th>
              <th className="px-4 py-3"><SortButton label="Total" k="total" /></th>
              <th className="px-4 py-3"><SortButton label="Qty" k="qty" /></th>
              <th className="px-4 py-3"><SortButton label="Price" k="price" /></th>
              <th className="px-4 py-3"><SortButton label="Name" k="name" /></th>
              <th className="px-4 py-3"><SortButton label="SKU" k="sku" /></th>
              <th className="px-4 py-3"><SortButton label="Order ID" k="order_id" /></th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((o, i) => (
              <tr key={o.id ?? o.order_id ?? i} className="border-t border-gray-100 dark:border-gray-800 text-sm">
                <td className="px-4 py-3">
                  {o.created_at ? new Date(o.created_at).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3">{o.method ?? "-"}</td>
                <td className="px-4 py-3 truncate max-w-[220px]">{o.customerKey ?? "-"}</td>
                <td className="px-4 py-3">${Number(o.total ?? (o.price ?? 0) * (o.qty ?? 1)).toFixed(2)}</td>
                <td className="px-4 py-3">{o.qty ?? 1}</td>
                <td className="px-4 py-3">${Number(o.price ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">{o.name ?? "-"}</td>
                <td className="px-4 py-3">{o.sku ?? "-"}</td>
                <td className="px-4 py-3">{o.order_id ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="text-xs opacity-70 px-1">المجموع: {displayed.length} / {rows.length} طلب.</div>
    </div>
  );
}