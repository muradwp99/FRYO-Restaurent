import { listIngredients } from "@/server/ingredients";
import { IngredientsManager } from "@/components/admin/catalog/IngredientsManager";

export const dynamic = "force-dynamic";

export default async function IngredientsPage() {
  const ingredients = await listIngredients();
  return <IngredientsManager ingredients={ingredients} />;
}
