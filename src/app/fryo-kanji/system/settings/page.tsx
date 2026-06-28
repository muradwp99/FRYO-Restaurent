import { getSettings } from "@/server/settings";
import { SettingsEditor } from "@/components/admin/system/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsEditor initial={settings} />;
}
