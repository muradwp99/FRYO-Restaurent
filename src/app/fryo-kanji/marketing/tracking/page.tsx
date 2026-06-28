import { getTracking } from "@/server/tracking";
import { TrackingEditor } from "@/components/admin/marketing/TrackingEditor";

export const dynamic = "force-dynamic";

export default async function TrackingPage() {
  const tracking = await getTracking();
  return <TrackingEditor initial={tracking} />;
}
