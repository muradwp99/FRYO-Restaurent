import { listMedia } from "@/server/media";
import { MediaManager } from "@/components/admin/system/MediaManager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = await listMedia();
  return <MediaManager items={items} />;
}
