import { getTestimonialsContent } from "@/server/content";
import { TestimonialsEditor } from "@/components/admin/content/TestimonialsEditor";

export const dynamic = "force-dynamic";

export default async function TestimonialsContentPage() {
  const initial = await getTestimonialsContent();
  return <TestimonialsEditor initial={initial} />;
}
