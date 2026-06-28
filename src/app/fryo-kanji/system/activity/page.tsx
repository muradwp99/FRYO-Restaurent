import { listActivity } from "@/server/activity";
import { ActivityLog } from "@/components/admin/system/ActivityLog";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const entries = await listActivity();
  return <ActivityLog entries={entries} />;
}
