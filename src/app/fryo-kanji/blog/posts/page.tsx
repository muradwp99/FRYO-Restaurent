import { listPosts } from "@/server/blog";
import { PostsManager } from "@/components/admin/blog/PostsManager";

export const dynamic = "force-dynamic";

export default async function BlogPostsPage() {
  const posts = await listPosts();
  return <PostsManager posts={posts} />;
}
