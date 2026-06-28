import { listMenu } from "@/server/menu";
import { listCategories } from "@/server/categories";
import { FoodsManager } from "@/components/admin/foods/FoodsManager";

// CMS-backed admin list — always read the latest from the store.
export const dynamic = "force-dynamic";

export default async function FoodsPage() {
  const [items, categories] = await Promise.all([listMenu(), listCategories()]);
  return <FoodsManager items={items} categories={categories.map((c) => c.name)} />;
}
