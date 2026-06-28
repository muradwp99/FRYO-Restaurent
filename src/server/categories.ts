import "server-only";
import { readCollection, writeCollection, uniqueId, slugify } from "./store";

export type Category = { id: string; name: string; slug: string; order: number };

const COLLECTION = "categories";

const seed: Category[] = [
  { id: "burgers", name: "Burgers", slug: "burgers", order: 1 },
  { id: "wraps", name: "Wraps", slug: "wraps", order: 2 },
];

export async function listCategories(): Promise<Category[]> {
  const rows = await readCollection<Category>(COLLECTION, seed);
  return [...rows].sort((a, b) => a.order - b.order);
}

export type CategoryInput = { id?: string; name: string; order: number };

export async function saveCategory(input: CategoryInput): Promise<Category> {
  const rows = await listCategories();
  if (input.id) {
    let updated: Category | null = null;
    const next = rows.map((c) => {
      if (c.id !== input.id) return c;
      updated = { ...c, name: input.name, slug: slugify(input.name) || c.slug, order: input.order };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "category", rows.map((c) => c.id));
  const cat: Category = { id, name: input.name, slug: slugify(input.name) || id, order: input.order };
  await writeCollection(COLLECTION, [...rows, cat]);
  return cat;
}

export async function deleteCategory(id: string): Promise<void> {
  const rows = await listCategories();
  await writeCollection(COLLECTION, rows.filter((c) => c.id !== id));
}
