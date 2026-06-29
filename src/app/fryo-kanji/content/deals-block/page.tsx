import { getDealsBlockContent } from "@/server/content";
import { DealsBlockEditor } from "@/components/admin/content/DealsBlockEditor";

export const dynamic = "force-dynamic";

export default async function DealsBlockContentPage() {
  const initial = await getDealsBlockContent();
  return <DealsBlockEditor initial={initial} />;
}
