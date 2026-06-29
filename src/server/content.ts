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

/* ── Homepage section copy (data — menu items, deals, reviews — stays in its own stores) ── */
export type LineupContent = { eyebrow: string; title: string; titleAccent: string; ctaLabel: string };
export type MenuSectionContent = { eyebrow: string; title: string; titleAccent: string };
export type DealsBlockContent = { eyebrow: string; title: string; titleAccent: string; ctaLabel: string };

export type ManualTestimonial = { quote: string; author: string; rating: number };
export type TestimonialsContent = {
  eyebrow: string;
  title: string;
  /** Pull Approved + "show on home" reviews automatically. When false, use {@link manual}. */
  autoPull: boolean;
  manual: ManualTestimonial[];
};
export type NewsletterContent = { heading: string; blurb: string; placeholder: string };

export type ContentBlocks = {
  contact: ContactContent;
  about: AboutContent;
  hero: HeroContent;
  steps: StepsContent;
  lineup: LineupContent;
  menuSection: MenuSectionContent;
  dealsBlock: DealsBlockContent;
  testimonials: TestimonialsContent;
  newsletter: NewsletterContent;
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
  lineup: {
    eyebrow: "The Lineup",
    title: "Six Builds.",
    titleAccent: "One Obsession.",
    ctaLabel: "Customize",
  },
  menuSection: {
    eyebrow: "The Goods",
    title: "Our",
    titleAccent: "Menu",
  },
  dealsBlock: {
    eyebrow: "Save More",
    title: "Today's",
    titleAccent: "Deals",
    ctaLabel: "View All Deals",
  },
  testimonials: {
    eyebrow: "Word On The Street",
    title: "Loved By The Hungry",
    autoPull: true,
    manual: [
      { quote: "The Super Charger is dangerously good. That Algerian sauce should be illegal.", author: "Maya R.", rating: 5 },
      { quote: "Customised my BBQ burger exactly how I like it. Showed up hot and perfect.", author: "Tariq B.", rating: 5 },
      { quote: "Fastest delivery in the city and the wraps actually hold together. Obsessed.", author: "Jess W.", rating: 5 },
    ],
  },
  newsletter: {
    heading: "Get The Drop",
    blurb: "New builds, secret deals and free-food giveaways. No spam, just sauce.",
    placeholder: "you@example.com",
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
    lineup: { ...CONTENT_DEFAULTS.lineup, ...stored.lineup },
    menuSection: { ...CONTENT_DEFAULTS.menuSection, ...stored.menuSection },
    dealsBlock: { ...CONTENT_DEFAULTS.dealsBlock, ...stored.dealsBlock },
    testimonials: { ...CONTENT_DEFAULTS.testimonials, ...stored.testimonials },
    newsletter: { ...CONTENT_DEFAULTS.newsletter, ...stored.newsletter },
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

export async function getLineupContent(): Promise<LineupContent> {
  return (await getAllContent()).lineup;
}

export async function getMenuSectionContent(): Promise<MenuSectionContent> {
  return (await getAllContent()).menuSection;
}

export async function getDealsBlockContent(): Promise<DealsBlockContent> {
  return (await getAllContent()).dealsBlock;
}

export async function getTestimonialsContent(): Promise<TestimonialsContent> {
  return (await getAllContent()).testimonials;
}

export async function getNewsletterContent(): Promise<NewsletterContent> {
  return (await getAllContent()).newsletter;
}

export async function updateContent<K extends keyof ContentBlocks>(key: K, data: ContentBlocks[K]): Promise<void> {
  const all = await getAllContent();
  all[key] = data;
  await writeObject(FILE, all);
}
