import "server-only";
import { readObject, writeObject } from "./store";
import { getSettings } from "./settings";
import { getContactContent } from "./content";
import { getGlobalSeo } from "./seo";
import { getSocials } from "./appearance";

export type SchemaSettings = {
  enabled: boolean;
  priceRange: string;
};

const FILE = "schema";
const DEFAULTS: SchemaSettings = { enabled: true, priceRange: "££" };

export async function getSchemaSettings(): Promise<SchemaSettings> {
  const s = await readObject<Partial<SchemaSettings>>(FILE, DEFAULTS);
  return { ...DEFAULTS, ...s };
}

export async function updateSchemaSettings(data: SchemaSettings): Promise<void> {
  await writeObject(FILE, data);
}

const DAY_ABBR: Record<string, string> = {
  Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th", Friday: "Fr", Saturday: "Sa", Sunday: "Su",
};

/** Build a schema.org Restaurant JSON-LD object from the various CMS stores. */
export async function getRestaurantSchema(): Promise<{ enabled: boolean; jsonLd: Record<string, unknown> }> {
  const [schema, settings, contact, seo, socials] = await Promise.all([
    getSchemaSettings(),
    getSettings(),
    getContactContent(),
    getGlobalSeo(),
    getSocials(),
  ]);

  const openingHours = settings.hours
    .filter((h) => !h.closed)
    .map((h) => `${DAY_ABBR[h.day] ?? h.day} ${h.open}-${h.close}`);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.restaurantName,
    description: seo.defaultDescription,
    url: seo.siteUrl,
    telephone: settings.phone || contact.phone,
    email: settings.email || contact.email,
    priceRange: schema.priceRange,
    servesCuisine: ["Burgers", "Wraps"],
    image: `${seo.siteUrl}${seo.ogImage}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine1,
      addressLocality: contact.addressLine2,
    },
    openingHours,
    sameAs: socials.map((s) => s.url),
  };

  return { enabled: schema.enabled, jsonLd };
}
