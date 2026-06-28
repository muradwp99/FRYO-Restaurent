"use server";

import { revalidatePath } from "next/cache";
import { saveCombo, deleteCombo, type ComboInput } from "@/server/combos";
import { saveIngredient, deleteIngredient, type IngredientInput } from "@/server/ingredients";

/* ── Combos ── */
export async function saveComboAction(input: ComboInput) {
  const c = await saveCombo(input);
  revalidatePath("/fryo-kanji/catalog/combos");
  return { ok: true as const, id: c.id };
}

export async function deleteComboAction(id: string) {
  await deleteCombo(id);
  revalidatePath("/fryo-kanji/catalog/combos");
  return { ok: true as const };
}

/* ── Ingredients ── */
export async function saveIngredientAction(input: IngredientInput) {
  const i = await saveIngredient(input);
  revalidatePath("/fryo-kanji/catalog/ingredients");
  return { ok: true as const, id: i.id };
}

export async function deleteIngredientAction(id: string) {
  await deleteIngredient(id);
  revalidatePath("/fryo-kanji/catalog/ingredients");
  return { ok: true as const };
}
