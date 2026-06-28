import "server-only";
import { getGlobalSeo } from "./seo";
import { getPublicMenu } from "./menu";
import { getPublishedPosts } from "./blog";

export type SitemapEntry = { url: string; path: string; type: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number };

/** Build the full list of public URLs from the live CMS data. Shared by sitemap.ts, robots.ts and the admin view. */
export async function getSitemapEntries(): Promise<{ base: string; entries: SitemapEntry[] }> {
  const seo = await getGlobalSeo();
  const base = seo.siteUrl.replace(/\/$/, "");
  const [menu, posts] = await Promise.all([getPublicMenu(), getPublishedPosts()]);

  const make = (path: string, type: string, changeFrequency: SitemapEntry["changeFrequency"], priority: number): SitemapEntry => ({
    url: `${base}${path}`,
    path,
    type,
    changeFrequency,
    priority,
  });

  const entries: SitemapEntry[] = [
    make("/", "Page", "weekly", 1),
    make("/deals", "Page", "weekly", 0.7),
    make("/about", "Page", "monthly", 0.6),
    make("/blog", "Page", "weekly", 0.7),
    make("/cart", "Page", "monthly", 0.3),
    ...menu.map((m) => make(`/food/${m.id}`, "Menu item", "weekly", 0.8)),
    ...posts.map((p) => make(`/blog/${p.slug}`, "Blog post", "monthly", 0.6)),
  ];

  return { base, entries };
}
