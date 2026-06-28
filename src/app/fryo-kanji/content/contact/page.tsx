import { getContactContent } from "@/server/content";
import { ContactEditor } from "@/components/admin/content/ContactEditor";

export const dynamic = "force-dynamic";

export default async function ContactContentPage() {
  const initial = await getContactContent();
  return <ContactEditor initial={initial} />;
}
