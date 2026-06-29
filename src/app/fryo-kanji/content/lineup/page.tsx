import { getLineupContent } from "@/server/content";
import { LineupEditor } from "@/components/admin/content/LineupEditor";

export const dynamic = "force-dynamic";

export default async function LineupContentPage() {
  const initial = await getLineupContent();
  return <LineupEditor initial={initial} />;
}
