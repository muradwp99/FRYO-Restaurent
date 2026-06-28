"use server";

import { revalidatePath } from "next/cache";
import { updateSettings, type GeneralSettings } from "@/server/settings";

export async function saveSettingsAction(data: GeneralSettings) {
  await updateSettings(data);
  revalidatePath("/fryo-kanji/system/settings");
  return { ok: true as const };
}
