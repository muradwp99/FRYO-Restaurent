import "server-only";
import { readObject, writeObject } from "./store";

/* ── Block shapes ── */
export type ContactContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  hoursDays: string;
  hoursTime: string;
};

export type AboutStat = { value: string; label: string };
export type AboutContent = {
  eyebrow: string;
  headingTop: string;
  headingAccent: string;
  paragraph1: string;
  paragraph2: string;
  ribbonTitle: string;
  ribbonSub: string;
  stats: AboutStat[];
};

export type HeroScene = { heading: string; sub: string; body: string };
export type HeroStat = { target: number; suffix: string; label: string };
export type HeroContent = { scenes: HeroScene[]; stats: HeroStat[] };

export type Step = { title: string; body: string };
export type StepsContent = { eyebrow: string; title: string; steps: Step[] };

export type ContentBlocks = {
  contact: ContactContent;
  about: AboutContent;
  hero: HeroContent;
  steps: StepsContent;
};

export const CONTENT_DEFAULTS: ContentBlocks = {
  contact: {
    eyebrow: "Say Hello",
    title: "Get In",
    titleAccent: "Touch",
    addressLine1: "42 Flame Street",
    addressLine2: "Manchester, M1 4FR",
    phone: "+44 161 555 0142",
    email: "hello@fryo.co.uk",
    hoursDays: "Mon–Sun",
    hoursTime: "11:00 – 23:00",
  },
  about: {
    eyebrow: "Who We Are",
    headingTop: "Big Flavour,",
    headingAccent: "No Compromise.",
    paragraph1:
      "FRYO is a fast-food joint obsessed with one thing: getting it right. Smash-style fillets seared to order, toasted buns and tortillas, and sauces we make in-house — from our smooth B&H mayo to that famous Algerian kick.",
    paragraph2:
      "Classic, Super Charger or BBQ — whichever you grab, it's built fresh, stacked loud and ready in minutes.",
    ribbonTitle: "Since Day One",
    ribbonSub: "FRIED TO PERFECTION",
    stats: [
      { value: "100%", label: "Fresh Fillets" },
      { value: "6", label: "Signature Builds" },
      { value: "£3.50", label: "Starting Price" },
      { value: "<10m", label: "To Your Hands" },
    ],
  },
  hero: {
    scenes: [
      { heading: "Built\nBy Hand", sub: "Stacked To Order", body: "Seared fillet, melted cheese, crisp lettuce and house B&H mayo — layered by hand and pressed fresh. Scroll and watch it come apart, piece by piece." },
      { heading: "Sauced\n& Loaded", sub: "Drip You Can Feel", body: "From smooth B&H mayo to that famous Algerian kick, every FRYO is finished with sauce that refuses to quit." },
      { heading: "This\nIs FRYO", sub: "Order In Seconds", body: "Tap a burger, build your bag and skip the queue. Your next craving is just one scroll away." },
    ],
    stats: [
      { target: 25, suffix: "K+", label: "Orders Served" },
      { target: 9, suffix: "K+", label: "Happy Customers" },
      { target: 6, suffix: "", label: "Signature Dishes" },
    ],
  },
  steps: {
    eyebrow: "How It Works",
    title: "Four Steps To Flavour",
    steps: [
      { title: "Pick Your Build", body: "Browse six signature burgers and wraps, each one stacked to order." },
      { title: "Make It Yours", body: "Swap the bun, dial the spice, drop ingredients and pile on extras." },
      { title: "Drop It In The Bag", body: "Build your order, review your bag and breeze through checkout." },
      { title: "Fired & Delivered", body: "We fry it fresh and track it to your door in real time." },
    ],
  },
};

const FILE = "content";

export async function getAllContent(): Promise<ContentBlocks> {
  const stored = await readObject<Partial<ContentBlocks>>(FILE, CONTENT_DEFAULTS);
  // merge so newly-added block keys always have defaults
  return {
    contact: { ...CONTENT_DEFAULTS.contact, ...stored.contact },
    about: { ...CONTENT_DEFAULTS.about, ...stored.about },
    hero: { ...CONTENT_DEFAULTS.hero, ...stored.hero },
    steps: { ...CONTENT_DEFAULTS.steps, ...stored.steps },
  };
}

export async function getContactContent(): Promise<ContactContent> {
  return (await getAllContent()).contact;
}

export async function getAboutContent(): Promise<AboutContent> {
  return (await getAllContent()).about;
}

export async function getHeroContent(): Promise<HeroContent> {
  return (await getAllContent()).hero;
}

export async function getStepsContent(): Promise<StepsContent> {
  return (await getAllContent()).steps;
}

export async function updateContent<K extends keyof ContentBlocks>(key: K, data: ContentBlocks[K]): Promise<void> {
  const all = await getAllContent();
  all[key] = data;
  await writeObject(FILE, all);
}
