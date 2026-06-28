"use server";

import { revalidatePath } from "next/cache";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItemInput,
  type MenuStatus,
} from "@/server/menu";

/** Refresh every surface a menu change can affect: public site + admin. */
function revalidateMenu(id?: string) {
  revalidatePath("/"); // home Lineup + Menu grid
  revalidatePath("/food/[id]", "page"); // all detail pages
  if (id) revalidatePath(`/food/${id}`);
  revalidatePath("/fryo-kanji/foods"); // admin list
}

export async function saveMenuItemAction(input: MenuItemInput) {
  const item = input.id ? await updateMenuItem(input.id, input) : await createMenuItem(input);
  revalidateMenu(item?.id ?? input.id);
  return { ok: true as const, id: item?.id ?? input.id };
}

export async function deleteMenuItemAction(id: string) {
  await deleteMenuItem(id);
  revalidateMenu(id);
  return { ok: true as const };
}

export async function setMenuStatusAction(id: string, status: MenuStatus) {
  await updateMenuItem(id, { status });
  revalidateMenu(id);
  return { ok: true as const };
}
