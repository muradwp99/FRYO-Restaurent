import { listOrders } from "@/server/orders";
import { listMenu } from "@/server/menu";
import { ReportsView } from "@/components/admin/insights/ReportsView";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [orders, menu] = await Promise.all([listOrders(), listMenu()]);
  return <ReportsView orders={orders} menu={menu} />;
}
