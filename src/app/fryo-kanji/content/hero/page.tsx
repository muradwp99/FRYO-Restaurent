import { getHeroContent } from "@/server/content";
import { HeroEditor } from "@/components/admin/content/HeroEditor";

export const dynamic = "force-dynamic";

export default async function HeroContentPage() {
  const initial = await getHeroContent();
  return <HeroEditor initial={initial} />;
}
