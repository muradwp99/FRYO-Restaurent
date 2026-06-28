"use server";

import { revalidatePath } from "next/cache";
import { updateSchemaSettings, type SchemaSettings } from "@/server/schema";

export async function saveSchemaSettingsAction(data: SchemaSettings) {
  await updateSchemaSettings(data);
  revalidatePath("/");
  revalidatePath("/fryo-kanji/marketing/schema");
  return { ok: true as const };
}
