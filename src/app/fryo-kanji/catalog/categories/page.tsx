import { listCategories } from "@/server/categories";
import { CategoriesManager } from "@/components/admin/catalog/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();
  return <CategoriesManager categories={categories} />;
}
