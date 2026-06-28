import { listCampaigns } from "@/server/campaigns";
import { CampaignsManager } from "@/components/admin/marketing/CampaignsManager";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();
  return <CampaignsManager campaigns={campaigns} />;
}
