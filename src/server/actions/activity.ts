"use server";

import { revalidatePath } from "next/cache";
import { clearActivity } from "@/server/activity";

export async function clearActivityAction() {
  await clearActivity();
  revalidatePath("/fryo-kanji/system/activity");
  return { ok: true as const };
}
