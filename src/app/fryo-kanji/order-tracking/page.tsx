import { listOrders } from "@/server/orders";
import { OrderTrackingBoard } from "@/components/admin/orders/OrderTrackingBoard";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage() {
  const orders = await listOrders();
  return <OrderTrackingBoard orders={orders} />;
}
