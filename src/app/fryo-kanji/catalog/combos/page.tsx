import { listCombos } from "@/server/combos";
import { CombosManager } from "@/components/admin/catalog/CombosManager";

export const dynamic = "force-dynamic";

export default async function CombosPage() {
  const combos = await listCombos();
  return <CombosManager combos={combos} />;
}
