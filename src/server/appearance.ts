import "server-only";
import { readObject, writeObject } from "./store";

export const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "Twitter", "YouTube", "TikTok", "Website"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialLink = { platform: SocialPlatform; url: string };

/* ── Navigation menu (shared by header + footer) ── */
export type NavLinkType = "route" | "scroll";
export type NavLinkItem = { label: string; href: string; type: NavLinkType };
export type NavConfig = { links: NavLinkItem[] };

/* ── Header ── */
export type HeaderConfig = { featuredLabel: string; showFeatured: boolean; showAccount: boolean };

/* ── Footer ── */
export type FooterConfig = { tagline: string; exploreHeading: string; visitHeading: string };

/* ── Theme & branding ── */
export type ThemeConfig = { brandName: string; footerWordmark: string };

/* ── Announcement bar ── */
export type AnnouncementConfig = { enabled: boolean; message: string; linkLabel: string; linkHref: string };

export type Appearance = {
  socials: SocialLink[];
  nav: NavConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  theme: ThemeConfig;
  announcement: AnnouncementConfig;
};

const FILE = "appearance";

const DEFAULTS: Appearance = {
  socials: [
    { platform: "Instagram", url: "https://instagram.com/fryo" },
    { platform: "Twitter", url: "https://x.com/fryo" },
    { platform: "Facebook", url: "https://facebook.com/fryo" },
  ],
  nav: {
    links: [
      { label: "Home", href: "/", type: "route" },
      { label: "Menu", href: "/menu", type: "route" },
      { label: "Deals", href: "/deals", type: "route" },
      { label: "About", href: "/about", type: "route" },
      { label: "Blog", href: "/blog", type: "route" },
      { label: "Contact", href: "/contact", type: "route" },
    ],
  },
  header: { featuredLabel: "Featured", showFeatured: true, showAccount: true },
  footer: { tagline: "Fresh · Fried · Fearless", exploreHeading: "Explore", visitHeading: "Visit" },
  theme: { brandName: "FRYO", footerWordmark: "FRYO" },
  announcement: { enabled: false, message: "Free delivery on orders over £20 🔥", linkLabel: "Order now", linkHref: "/#menu" },
};

export async function getAppearance(): Promise<Appearance> {
  const stored = await readObject<Partial<Appearance>>(FILE, DEFAULTS);
  return {
    socials: stored.socials ?? DEFAULTS.socials,
    nav: { ...DEFAULTS.nav, ...stored.nav },
    header: { ...DEFAULTS.header, ...stored.header },
    footer: { ...DEFAULTS.footer, ...stored.footer },
    theme: { ...DEFAULTS.theme, ...stored.theme },
    announcement: { ...DEFAULTS.announcement, ...stored.announcement },
  };
}

export async function getSocials(): Promise<SocialLink[]> {
  return (await getAppearance()).socials;
}
export async function getNav(): Promise<NavConfig> {
  return (await getAppearance()).nav;
}
export async function getHeaderConfig(): Promise<HeaderConfig> {
  return (await getAppearance()).header;
}
export async function getFooterConfig(): Promise<FooterConfig> {
  return (await getAppearance()).footer;
}
export async function getTheme(): Promise<ThemeConfig> {
  return (await getAppearance()).theme;
}
export async function getAnnouncement(): Promise<AnnouncementConfig> {
  return (await getAppearance()).announcement;
}

async function patch<K extends keyof Appearance>(key: K, value: Appearance[K]): Promise<void> {
  const all = await getAppearance();
  all[key] = value;
  await writeObject(FILE, all);
}

export const updateSocials = (socials: SocialLink[]) => patch("socials", socials);
export const updateNav = (nav: NavConfig) => patch("nav", nav);
export const updateHeader = (header: HeaderConfig) => patch("header", header);
export const updateFooterConfig = (footer: FooterConfig) => patch("footer", footer);
export const updateTheme = (theme: ThemeConfig) => patch("theme", theme);
export const updateAnnouncement = (announcement: AnnouncementConfig) => patch("announcement", announcement);
