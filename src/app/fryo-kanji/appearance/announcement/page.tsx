import { getAnnouncement } from "@/server/appearance";
import { AnnouncementEditor } from "@/components/admin/appearance/AnnouncementEditor";

export const dynamic = "force-dynamic";

export default async function AnnouncementAppearancePage() {
  const announcement = await getAnnouncement();
  return <AnnouncementEditor initial={announcement} />;
}
