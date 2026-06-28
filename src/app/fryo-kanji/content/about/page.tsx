import { getAboutContent } from "@/server/content";
import { AboutEditor } from "@/components/admin/content/AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  const initial = await getAboutContent();
  return <AboutEditor initial={initial} />;
}
