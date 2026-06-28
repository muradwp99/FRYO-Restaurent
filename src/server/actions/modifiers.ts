"use server";

import { revalidatePath } from "next/cache";
import { saveModifierGroup, deleteModifierGroup, type ModifierGroupInput } from "@/server/modifiers";

function revalidateModifiers() {
  revalidatePath("/fryo-kanji/catalog/modifiers");
  revalidatePath("/food/[id]", "page"); // customize flow reflects new options/prices
}

export async function saveModifierGroupAction(input: ModifierGroupInput) {
  const g = await saveModifierGroup(input);
  revalidateModifiers();
  return { ok: true as const, id: g.id };
}

export async function deleteModifierGroupAction(id: string) {
  await deleteModifierGroup(id);
  revalidateModifiers();
  return { ok: true as const };
}
