"use server";

import { revalidatePath } from "next/cache";
import { setIntegrationConnected } from "@/server/integrations";
import { setNotificationPref, type NotifChannel } from "@/server/notifications";
import { addMedia, deleteMedia } from "@/server/media";
import { createBackup, deleteBackup } from "@/server/backups";

export async function setIntegrationAction(id: string, connected: boolean) {
  await setIntegrationConnected(id, connected);
  revalidatePath("/fryo-kanji/system/integrations");
  return { ok: true as const };
}

export async function setNotificationAction(id: string, channel: NotifChannel, value: boolean) {
  await setNotificationPref(id, channel, value);
  revalidatePath("/fryo-kanji/system/notifications");
  return { ok: true as const };
}

export async function addMediaAction(input: { name: string; url: string }) {
  const m = await addMedia(input);
  revalidatePath("/fryo-kanji/system/media");
  return { ok: true as const, id: m.id };
}

export async function deleteMediaAction(id: string) {
  await deleteMedia(id);
  revalidatePath("/fryo-kanji/system/media");
  return { ok: true as const };
}

export async function createBackupAction() {
  const b = await createBackup();
  revalidatePath("/fryo-kanji/system/backups");
  return { ok: true as const, id: b.id };
}

export async function deleteBackupAction(id: string) {
  await deleteBackup(id);
  revalidatePath("/fryo-kanji/system/backups");
  return { ok: true as const };
}
