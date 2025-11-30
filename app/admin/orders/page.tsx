import Layout from "@/components/tailadmin/layout/Layout";
import OrdersTable from "@/components/tailadmin/tables/OrdersTable";

export default function OrdersPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">إدارة الطلبات</h1>
      <OrdersTable />
    </Layout>
  );
}