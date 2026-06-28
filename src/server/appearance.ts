import "server-only";
import { readObject, writeObject } from "./store";

export const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "Twitter", "YouTube", "TikTok", "Website"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialLink = { platform: SocialPlatform; url: string };

export type Appearance = {
  socials: SocialLink[];
};

const FILE = "appearance";

const DEFAULTS: Appearance = {
  socials: [
    { platform: "Instagram", url: "https://instagram.com/fryo" },
    { platform: "Twitter", url: "https://x.com/fryo" },
    { platform: "Facebook", url: "https://facebook.com/fryo" },
  ],
};

export async function getAppearance(): Promise<Appearance> {
  const stored = await readObject<Partial<Appearance>>(FILE, DEFAULTS);
  return { socials: stored.socials ?? DEFAULTS.socials };
}

export async function getSocials(): Promise<SocialLink[]> {
  return (await getAppearance()).socials;
}

export async function updateSocials(socials: SocialLink[]): Promise<void> {
  const all = await getAppearance();
  all.socials = socials;
  await writeObject(FILE, all);
}
