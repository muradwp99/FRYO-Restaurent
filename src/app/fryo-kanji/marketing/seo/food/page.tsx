import { listMenu } from "@/server/menu";
import { listFoodSeo } from "@/server/seo";
import { ItemSeoEditor, type SeoTarget } from "@/components/admin/seo/ItemSeoEditor";

export const dynamic = "force-dynamic";

export default async function FoodSeoPage() {
  const [menu, overrides] = await Promise.all([listMenu(), listFoodSeo()]);
  const items: SeoTarget[] = menu.map((m) => ({
    key: m.id,
    label: m.name,
    subtitle: m.category,
    fallbackTitle: `${m.name} — FRYO`,
    fallbackDescription: m.description,
  }));
  return <ItemSeoEditor kind="food" items={items} initial={overrides} />;
}
