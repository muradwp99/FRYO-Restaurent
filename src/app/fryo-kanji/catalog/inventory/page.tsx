import { listMenu } from "@/server/menu";
import { InventoryManager } from "@/components/admin/inventory/InventoryManager";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const items = await listMenu();
  return <InventoryManager items={items} />;
}
