import "server-only";
import type { Metadata } from "next";
import { readObject, writeObject } from "./store";

export type GlobalSeo = {
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
};

export type PageSeo = {
  path: string;
  label: string;
  title: string;
  description: string;
};

export type SeoData = {
  global: GlobalSeo;
  pages: PageSeo[];
};

const FILE = "seo";

const DEFAULTS: SeoData = {
  global: {
    siteUrl: "https://fryo.example",
    defaultTitle: "FRYO — Burgers, Wraps & Pure Fire",
    titleTemplate: "%s — FRYO",
    defaultDescription:
      "FRYO serves smash-style burgers and loaded wraps. Classic, Super Charger and BBQ — freshly fried, boldly sauced.",
    ogImage: "/og.webp",
  },
  pages: [
    { path: "/", label: "Home", title: "FRYO — Burgers, Wraps & Pure Fire", description: "Smash-style burgers and loaded wraps. Classic, Super Charger and BBQ." },
    { path: "/deals", label: "Deals", title: "The Deals", description: "Stack the savings. Codes apply at checkout — tap to copy." },
  ],
};

export async function getSeoData(): Promise<SeoData> {
  const stored = await readObject<Partial<SeoData>>(FILE, DEFAULTS);
  return {
    global: { ...DEFAULTS.global, ...stored.global },
    pages: stored.pages ?? DEFAULTS.pages,
  };
}

export async function getGlobalSeo(): Promise<GlobalSeo> {
  return (await getSeoData()).global;
}

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  return (await getSeoData()).pages.find((p) => p.path === path) ?? null;
}

export async function listPageSeo(): Promise<PageSeo[]> {
  return (await getSeoData()).pages;
}

export async function updateGlobalSeo(data: GlobalSeo): Promise<void> {
  const all = await getSeoData();
  all.global = data;
  await writeObject(FILE, all);
}

export async function updatePageSeo(pages: PageSeo[]): Promise<void> {
  const all = await getSeoData();
  all.pages = pages;
  await writeObject(FILE, all);
}

/** Full Next Metadata for a public page — page override falling back to global, always keeping the OG image. */
export async function getPageMetadata(path: string): Promise<Metadata> {
  const { global, pages } = await getSeoData();
  const page = pages.find((p) => p.path === path);
  const title = page?.title ?? global.defaultTitle;
  const description = page?.description ?? global.defaultDescription;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, images: [global.ogImage] },
  };
}
