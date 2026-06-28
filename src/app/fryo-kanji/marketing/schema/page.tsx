import { getSchemaSettings, getRestaurantSchema } from "@/server/schema";
import { SchemaEditor } from "@/components/admin/marketing/SchemaEditor";

export const dynamic = "force-dynamic";

export default async function SchemaPage() {
  const [settings, { jsonLd }] = await Promise.all([getSchemaSettings(), getRestaurantSchema()]);
  return <SchemaEditor initial={settings} preview={jsonLd} />;
}
