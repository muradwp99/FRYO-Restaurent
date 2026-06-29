import { getHeroContent } from "@/server/content";
import { StatsEditor } from "@/components/admin/content/StatsEditor";

export const dynamic = "force-dynamic";

export default async function StatsContentPage() {
  const hero = await getHeroContent();
  return <StatsEditor initial={hero} />;
}
