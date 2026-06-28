import { listComments } from "@/server/blog";
import { CommentsManager } from "@/components/admin/blog/CommentsManager";

export const dynamic = "force-dynamic";

export default async function BlogCommentsPage() {
  const comments = await listComments();
  return <CommentsManager comments={comments} />;
}
