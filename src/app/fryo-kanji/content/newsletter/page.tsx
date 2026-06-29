import { getNewsletterContent } from "@/server/content";
import { NewsletterEditor } from "@/components/admin/content/NewsletterEditor";

export const dynamic = "force-dynamic";

export default async function NewsletterContentPage() {
  const initial = await getNewsletterContent();
  return <NewsletterEditor initial={initial} />;
}
