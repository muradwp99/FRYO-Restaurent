"use server";

import { revalidatePath } from "next/cache";
import { updateContent, type ContactContent, type AboutContent, type HeroContent, type StepsContent } from "@/server/content";

export async function saveContactContentAction(data: ContactContent) {
  await updateContent("contact", data);
  revalidatePath("/"); // homepage Contact section
  revalidatePath("/fryo-kanji/content/contact");
  return { ok: true as const };
}

export async function saveAboutContentAction(data: AboutContent) {
  await updateContent("about", data);
  revalidatePath("/"); // homepage About section
  revalidatePath("/fryo-kanji/content/about");
  return { ok: true as const };
}

export async function saveHeroContentAction(data: HeroContent) {
  await updateContent("hero", data);
  revalidatePath("/"); // homepage Hero
  revalidatePath("/fryo-kanji/content/hero");
  return { ok: true as const };
}

export async function saveStepsContentAction(data: StepsContent) {
  await updateContent("steps", data);
  revalidatePath("/"); // homepage How It Works
  revalidatePath("/fryo-kanji/content/how-it-works");
  return { ok: true as const };
}
