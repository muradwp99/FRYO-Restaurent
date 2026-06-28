import { getCustomCode } from "@/server/customcode";
import { CustomCodeEditor } from "@/components/admin/marketing/CustomCodeEditor";

export const dynamic = "force-dynamic";

export default async function CustomCodePage() {
  const code = await getCustomCode();
  return <CustomCodeEditor initial={code} />;
}
