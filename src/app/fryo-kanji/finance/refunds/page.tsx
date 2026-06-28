import { listRefunds } from "@/server/finance";
import { RefundsManager } from "@/components/admin/finance/RefundsManager";

export const dynamic = "force-dynamic";

export default async function RefundsPage() {
  const refunds = await listRefunds();
  return <RefundsManager refunds={refunds} />;
}
