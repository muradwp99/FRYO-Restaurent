import { listDeals } from "@/server/deals";
import { DealsManager } from "@/components/admin/deals/DealsManager";

export const dynamic = "force-dynamic";

export default async function AdminDealsPage() {
  const deals = await listDeals();
  return <DealsManager deals={deals} />;
}
