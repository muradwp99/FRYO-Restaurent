"use server";

import { revalidatePath } from "next/cache";
import { saveRedirect, deleteRedirect, type RedirectInput } from "@/server/redirects";

export async function saveRedirectAction(input: RedirectInput) {
  const r = await saveRedirect(input);
  revalidatePath("/fryo-kanji/marketing/redirects");
  return { ok: true as const, id: r.id };
}

export async function deleteRedirectAction(id: string) {
  await deleteRedirect(id);
  revalidatePath("/fryo-kanji/marketing/redirects");
  return { ok: true as const };
}
