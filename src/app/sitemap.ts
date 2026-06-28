import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/server/sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { entries } = await getSitemapEntries();
  return entries.map((e) => ({
    url: e.url,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
