import type { MetadataRoute } from "next";
import { getGlobalSeo } from "@/server/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getGlobalSeo();
  const base = seo.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/fryo-kanji" },
    sitemap: `${base}/sitemap.xml`,
  };
}
