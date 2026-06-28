"use server";

import { revalidatePath } from "next/cache";
import { saveCategory, deleteCategory, type CategoryInput } from "@/server/categories";

function revalidateCategories() {
  revalidatePath("/fryo-kanji/catalog/categories");
  revalidatePath("/fryo-kanji/foods");
  revalidatePath("/"); // homepage menu filter
}

export async function saveCategoryAction(input: CategoryInput) {
  const c = await saveCategory(input);
  revalidateCategories();
  return { ok: true as const, id: c.id };
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidateCategories();
  return { ok: true as const };
}
