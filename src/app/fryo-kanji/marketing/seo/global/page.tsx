import { getGlobalSeo } from "@/server/seo";
import { GlobalSeoEditor } from "@/components/admin/seo/GlobalSeoEditor";

export const dynamic = "force-dynamic";

export default async function GlobalSeoPage() {
  const seo = await getGlobalSeo();
  return <GlobalSeoEditor initial={seo} />;
}
