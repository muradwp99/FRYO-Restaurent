import { listPageSeo } from "@/server/seo";
import { PageSeoEditor } from "@/components/admin/seo/PageSeoEditor";

export const dynamic = "force-dynamic";

export default async function PageSeoPage() {
  const pages = await listPageSeo();
  return <PageSeoEditor initial={pages} />;
}
