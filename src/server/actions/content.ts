"use server";

import { revalidatePath } from "next/cache";
import {
  updateContent,
  type ContactContent,
  type AboutContent,
  type HeroContent,
  type StepsContent,
  type LineupContent,
  type MenuSectionContent,
  type DealsBlockContent,
  type TestimonialsContent,
  type NewsletterContent,
} from "@/server/content";

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

export async function saveLineupContentAction(data: LineupContent) {
  await updateContent("lineup", data);
  revalidatePath("/"); // homepage Lineup
  revalidatePath("/fryo-kanji/content/lineup");
  return { ok: true as const };
}

export async function saveMenuSectionContentAction(data: MenuSectionContent) {
  await updateContent("menuSection", data);
  revalidatePath("/"); // homepage Menu section
  revalidatePath("/fryo-kanji/content/menu-section");
  return { ok: true as const };
}

export async function saveDealsBlockContentAction(data: DealsBlockContent) {
  await updateContent("dealsBlock", data);
  revalidatePath("/"); // homepage Deals strip
  revalidatePath("/fryo-kanji/content/deals-block");
  return { ok: true as const };
}

export async function saveTestimonialsContentAction(data: TestimonialsContent) {
  await updateContent("testimonials", data);
  revalidatePath("/"); // homepage Testimonials
  revalidatePath("/fryo-kanji/content/testimonials");
  return { ok: true as const };
}

export async function saveNewsletterContentAction(data: NewsletterContent) {
  await updateContent("newsletter", data);
  revalidatePath("/"); // homepage footer newsletter
  revalidatePath("/fryo-kanji/content/newsletter");
  return { ok: true as const };
}
