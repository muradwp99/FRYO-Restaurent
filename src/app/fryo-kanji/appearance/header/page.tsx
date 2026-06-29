import { getHeaderConfig } from "@/server/appearance";
import { HeaderEditor } from "@/components/admin/appearance/HeaderEditor";

export const dynamic = "force-dynamic";

export default async function HeaderAppearancePage() {
  const header = await getHeaderConfig();
  return <HeaderEditor initial={header} />;
}
