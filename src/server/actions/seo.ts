"use server";

import { revalidatePath } from "next/cache";
import {
  updateGlobalSeo,
  updatePageSeo,
  updateFoodSeo,
  updateBlogSeo,
  type GlobalSeo,
  type PageSeo,
  type ItemSeo,
} from "@/server/seo";

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

export async function saveFoodSeoAction(food: ItemSeo[]) {
  await updateFoodSeo(food);
  revalidatePath("/food", "layout"); // all /food/[id] metadata
  revalidatePath("/fryo-kanji/marketing/seo/food");
  return { ok: true as const };
}

export async function saveBlogSeoAction(blog: ItemSeo[]) {
  await updateBlogSeo(blog);
  revalidatePath("/blog", "layout"); // all /blog/[slug] metadata
  revalidatePath("/fryo-kanji/marketing/seo/blog");
  return { ok: true as const };
}
