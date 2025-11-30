export async function handleCheckout(item: any, playerId: string) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: item.name,
      price: item.price,
      sku: item.sku,
      playerId,
    }),
  });

  const data = await res.json();
  if (data?.url) {
    window.location.href = data.url; // يحوّل المستخدم لصفحة الدفع
  } else {
    alert("تعذر إنشاء جلسة الدفع. جرّب لاحقًا.");
  }
}