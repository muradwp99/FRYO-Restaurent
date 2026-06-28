import { getStepsContent } from "@/server/content";
import { StepsEditor } from "@/components/admin/content/StepsEditor";

export const dynamic = "force-dynamic";

export default async function HowItWorksContentPage() {
  const initial = await getStepsContent();
  return <StepsEditor initial={initial} />;
}
