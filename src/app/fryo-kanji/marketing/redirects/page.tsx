import { listRedirects } from "@/server/redirects";
import { RedirectsManager } from "@/components/admin/marketing/RedirectsManager";

export const dynamic = "force-dynamic";

export default async function RedirectsPage() {
  const redirects = await listRedirects();
  return <RedirectsManager redirects={redirects} />;
}
