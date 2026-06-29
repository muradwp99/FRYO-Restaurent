import { listPosts } from "@/server/blog";
import { listBlogSeo } from "@/server/seo";
import { ItemSeoEditor, type SeoTarget } from "@/components/admin/seo/ItemSeoEditor";

export const dynamic = "force-dynamic";

export default async function BlogSeoPage() {
  const [posts, overrides] = await Promise.all([listPosts(), listBlogSeo()]);
  const items: SeoTarget[] = posts.map((p) => ({
    key: p.slug,
    label: p.title,
    subtitle: p.status,
    fallbackTitle: p.title,
    fallbackDescription: p.excerpt,
  }));
  return <ItemSeoEditor kind="blog" items={items} initial={overrides} />;
}
