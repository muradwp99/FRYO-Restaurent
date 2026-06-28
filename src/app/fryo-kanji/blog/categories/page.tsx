import { listCategories } from "@/server/blog-taxonomy";
import { TermManager } from "@/components/admin/blog/TermManager";

export const dynamic = "force-dynamic";

export default async function BlogCategoriesPage() {
  const terms = await listCategories();
  return <TermManager kind="category" terms={terms} />;
}
