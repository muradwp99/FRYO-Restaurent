import { listTags } from "@/server/blog-taxonomy";
import { TermManager } from "@/components/admin/blog/TermManager";

export const dynamic = "force-dynamic";

export default async function BlogTagsPage() {
  const terms = await listTags();
  return <TermManager kind="tag" terms={terms} />;
}
