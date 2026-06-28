"use server";

import { revalidatePath } from "next/cache";
import { saveUser, deleteUser, type UserInput } from "@/server/users";

export async function saveUserAction(input: UserInput) {
  const u = await saveUser(input);
  revalidatePath("/fryo-kanji/system/users");
  return { ok: true as const, id: u.id };
}

export async function deleteUserAction(id: string) {
  await deleteUser(id);
  revalidatePath("/fryo-kanji/system/users");
  return { ok: true as const };
}
