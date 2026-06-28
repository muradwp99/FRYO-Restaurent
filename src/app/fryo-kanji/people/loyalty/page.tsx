import { getLoyaltyProgram, listRules } from "@/server/loyalty";
import { LoyaltyManager } from "@/components/admin/loyalty/LoyaltyManager";

export const dynamic = "force-dynamic";

export default async function LoyaltyPage() {
  const [program, rules] = await Promise.all([getLoyaltyProgram(), listRules()]);
  return <LoyaltyManager program={program} rules={rules} />;
}
