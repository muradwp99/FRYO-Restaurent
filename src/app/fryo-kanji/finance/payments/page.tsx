import { listPayouts, getPaymentSettings, stripeConfigured, paypalConfigured } from "@/server/finance";
import { PaymentsView } from "@/components/admin/finance/PaymentsView";
import { PaymentMethodsEditor } from "@/components/admin/finance/PaymentMethodsEditor";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const [payouts, payment] = await Promise.all([listPayouts(), getPaymentSettings()]);
  return (
    <div className="space-y-6">
      <PaymentMethodsEditor initial={payment} stripeConfigured={stripeConfigured()} paypalConfigured={paypalConfigured()} />
      <PaymentsView payouts={payouts} />
    </div>
  );
}
