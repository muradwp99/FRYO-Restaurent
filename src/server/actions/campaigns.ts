"use server";

import { revalidatePath } from "next/cache";
import { saveCampaign, deleteCampaign, type CampaignInput } from "@/server/campaigns";

export async function saveCampaignAction(input: CampaignInput) {
  const c = await saveCampaign(input);
  revalidatePath("/fryo-kanji/marketing/campaigns");
  return { ok: true as const, id: c.id };
}

export async function deleteCampaignAction(id: string) {
  await deleteCampaign(id);
  revalidatePath("/fryo-kanji/marketing/campaigns");
  return { ok: true as const };
}
