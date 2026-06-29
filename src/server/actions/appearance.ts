"use server";

import { revalidatePath } from "next/cache";
import {
  updateSocials,
  updateNav,
  updateHeader,
  updateFooterConfig,
  updateTheme,
  updateAnnouncement,
  type SocialLink,
  type NavConfig,
  type HeaderConfig,
  type FooterConfig,
  type ThemeConfig,
  type AnnouncementConfig,
} from "@/server/appearance";

/** Appearance touches site-wide chrome, so revalidate the whole public site. */
function revalidateSite(adminPath: string) {
  revalidatePath("/", "layout");
  revalidatePath(adminPath);
}

export async function saveSocialsAction(socials: SocialLink[]) {
  await updateSocials(socials);
  revalidateSite("/fryo-kanji/appearance/social");
  return { ok: true as const };
}

export async function saveNavAction(nav: NavConfig) {
  await updateNav(nav);
  revalidateSite("/fryo-kanji/appearance/nav");
  return { ok: true as const };
}

export async function saveHeaderAction(header: HeaderConfig) {
  await updateHeader(header);
  revalidateSite("/fryo-kanji/appearance/header");
  return { ok: true as const };
}

export async function saveFooterConfigAction(footer: FooterConfig) {
  await updateFooterConfig(footer);
  revalidateSite("/fryo-kanji/appearance/footer");
  return { ok: true as const };
}

export async function saveThemeAction(theme: ThemeConfig) {
  await updateTheme(theme);
  revalidateSite("/fryo-kanji/appearance/theme");
  return { ok: true as const };
}

export async function saveAnnouncementAction(announcement: AnnouncementConfig) {
  await updateAnnouncement(announcement);
  revalidateSite("/fryo-kanji/appearance/announcement");
  return { ok: true as const };
}
