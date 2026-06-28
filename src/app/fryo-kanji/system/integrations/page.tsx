import { listIntegrations } from "@/server/integrations";
import { IntegrationsManager } from "@/components/admin/system/IntegrationsManager";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const integrations = await listIntegrations();
  return <IntegrationsManager integrations={integrations} />;
}
