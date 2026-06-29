import { getMenuSectionContent } from "@/server/content";
import { MenuSectionEditor } from "@/components/admin/content/MenuSectionEditor";

export const dynamic = "force-dynamic";

export default async function MenuSectionContentPage() {
  const initial = await getMenuSectionContent();
  return <MenuSectionEditor initial={initial} />;
}
