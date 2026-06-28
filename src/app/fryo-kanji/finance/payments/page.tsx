import { listPayouts } from "@/server/finance";
import { PaymentsView } from "@/components/admin/finance/PaymentsView";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payouts = await listPayouts();
  return <PaymentsView payouts={payouts} />;
}
