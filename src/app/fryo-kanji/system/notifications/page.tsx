import { listNotificationPrefs } from "@/server/notifications";
import { NotificationsManager } from "@/components/admin/system/NotificationsManager";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const prefs = await listNotificationPrefs();
  return <NotificationsManager prefs={prefs} />;
}
