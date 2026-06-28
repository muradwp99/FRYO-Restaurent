"use server";

import { revalidatePath } from "next/cache";
import { updateSocials, type SocialLink } from "@/server/appearance";

export async function saveSocialsAction(socials: SocialLink[]) {
  await updateSocials(socials);
  revalidatePath("/"); // homepage Footer + Contact
  revalidatePath("/fryo-kanji/appearance/social");
  return { ok: true as const };
}
