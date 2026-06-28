import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type Ingredient = {
  id: string;
  name: string;
  allergens: string[];
  calories: number;
  inStock: boolean;
};

export const ALLERGENS = ["Gluten", "Dairy", "Egg", "Soy", "Sesame", "Nuts", "Mustard"] as const;

const COLLECTION = "ingredients";

const seed: Ingredient[] = [
  { id: "fillet", name: "Chicken Fillet", allergens: ["Gluten"], calories: 220, inStock: true },
  { id: "brioche", name: "Brioche Bun", allergens: ["Gluten", "Egg", "Dairy"], calories: 180, inStock: true },
  { id: "bh-mayo", name: "B&H Mayo", allergens: ["Egg", "Mustard"], calories: 90, inStock: true },
  { id: "algerian", name: "Algerian Hot Sauce", allergens: ["Mustard"], calories: 60, inStock: true },
  { id: "cheese", name: "American Cheese", allergens: ["Dairy"], calories: 70, inStock: true },
  { id: "tenders", name: "Golden Tenders", allergens: ["Gluten"], calories: 200, inStock: false },
];

export type IngredientInput = Omit<Ingredient, "id"> & { id?: string };

export async function listIngredients(): Promise<Ingredient[]> {
  return readCollection<Ingredient>(COLLECTION, seed);
}

export async function saveIngredient(input: IngredientInput): Promise<Ingredient> {
  const rows = await listIngredients();
  if (input.id) {
    let updated: Ingredient | null = null;
    const next = rows.map((i) => {
      if (i.id !== input.id) return i;
      updated = { ...i, ...input, id: i.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "ingredient", rows.map((i) => i.id));
  const ing: Ingredient = { ...input, id };
  await writeCollection(COLLECTION, [...rows, ing]);
  return ing;
}

export async function deleteIngredient(id: string): Promise<void> {
  const rows = await listIngredients();
  await writeCollection(COLLECTION, rows.filter((i) => i.id !== id));
}
