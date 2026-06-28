"use server";

import { revalidatePath } from "next/cache";
import { updateTracking, type TrackingSettings } from "@/server/tracking";

export async function saveTrackingAction(data: TrackingSettings) {
  await updateTracking(data);
  revalidatePath("/", "layout"); // scripts live in the root layout
  revalidatePath("/fryo-kanji/marketing/tracking");
  return { ok: true as const };
}
