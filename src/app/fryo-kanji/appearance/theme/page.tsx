import { getTheme } from "@/server/appearance";
import { ThemeEditor } from "@/components/admin/appearance/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function ThemeAppearancePage() {
  const theme = await getTheme();
  return <ThemeEditor initial={theme} />;
}
