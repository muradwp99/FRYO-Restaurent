"use server";

import { revalidatePath } from "next/cache";
import { updateCustomCode, type CustomCode } from "@/server/customcode";

export async function saveCustomCodeAction(data: CustomCode) {
  await updateCustomCode(data);
  revalidatePath("/", "layout");
  revalidatePath("/fryo-kanji/marketing/custom-code");
  return { ok: true as const };
}
