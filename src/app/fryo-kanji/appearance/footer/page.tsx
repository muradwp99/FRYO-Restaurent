import { getFooterConfig } from "@/server/appearance";
import { FooterEditor } from "@/components/admin/appearance/FooterEditor";

export const dynamic = "force-dynamic";

export default async function FooterAppearancePage() {
  const footer = await getFooterConfig();
  return <FooterEditor initial={footer} />;
}
