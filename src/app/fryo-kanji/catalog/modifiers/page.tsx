import { listModifierGroups } from "@/server/modifiers";
import { ModifiersManager } from "@/components/admin/modifiers/ModifiersManager";

export const dynamic = "force-dynamic";

export default async function ModifiersPage() {
  const groups = await listModifierGroups();
  return <ModifiersManager groups={groups} />;
}
