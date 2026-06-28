import { listAuthors } from "@/server/blog-taxonomy";
import { AuthorsManager } from "@/components/admin/blog/AuthorsManager";

export const dynamic = "force-dynamic";

export default async function BlogAuthorsPage() {
  const authors = await listAuthors();
  return <AuthorsManager authors={authors} />;
}
