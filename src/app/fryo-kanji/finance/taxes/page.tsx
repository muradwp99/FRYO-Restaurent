import { getFinanceSettings } from "@/server/finance";
import { TaxesEditor } from "@/components/admin/finance/TaxesEditor";

export const dynamic = "force-dynamic";

export default async function TaxesPage() {
  const settings = await getFinanceSettings();
  return <TaxesEditor initial={settings} />;
}
