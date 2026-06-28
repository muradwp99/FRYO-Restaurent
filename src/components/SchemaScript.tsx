import { getRestaurantSchema } from "@/server/schema";

/** Renders the Restaurant JSON-LD into the page when structured data is enabled. */
export async function SchemaScript() {
  const { enabled, jsonLd } = await getRestaurantSchema();
  if (!enabled) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
