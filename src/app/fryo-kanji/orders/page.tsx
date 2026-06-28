import { listOrders } from "@/server/orders";
import { OrdersManager } from "@/components/admin/orders/OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();
  return <OrdersManager orders={orders} />;
}
