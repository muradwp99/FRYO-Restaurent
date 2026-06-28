"use server";

import { revalidatePath } from "next/cache";
import { updateGlobalSeo, updatePageSeo, type GlobalSeo, type PageSeo } from "@/server/seo";

export async function saveGlobalSeoAction(data: GlobalSeo) {
  await updateGlobalSeo(data);
  revalidatePath("/", "layout"); // root layout metadata
  revalidatePath("/fryo-kanji/marketing/seo/global");
  return { ok: true as const };
}

export async function savePageSeoAction(pages: PageSeo[]) {
  await updatePageSeo(pages);
  revalidatePath("/", "layout");
  revalidatePath("/fryo-kanji/marketing/seo/pages");
  return { ok: true as const };
}
