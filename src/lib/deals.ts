export type Deal = {
  id: string;
  title: string;
  blurb: string;
  code: string;
  badge: string;
  tone: "gold" | "royal";
  cta: string;
  href: string;
};

export const DEALS: Deal[] = [
  {
    id: "first-order",
    title: "10% Off Your First Order",
    blurb: "New to FRYO? Use this code at checkout and enjoy 10% off your first order.",
    code: "WELCOME10",
    badge: "Save up to £2.50",
    tone: "gold",
    cta: "Claim Deal",
    href: "/#menu",
  },
  {
    id: "free-delivery",
    title: "Free Delivery Over £20",
    blurb: "Build your perfect meal and we'll waive the delivery fee. No code needed.",
    code: "FREEDELIVERY",
    badge: "Always active",
    tone: "royal",
    cta: "Order Now",
    href: "/#menu",
  },
  {
    id: "combo",
    title: "Combo Deal — Burger + Drink + Fries",
    blurb: "Any burger, loaded fries and a drink for just £10.99. Mix and match as you please.",
    code: "MEAL4LESS",
    badge: "Save up to £3.00",
    tone: "gold",
    cta: "Build Combo",
    href: "/#menu",
  },
  {
    id: "loyalty",
    title: "Loyalty Points Double Day",
    blurb: "Every Thursday, earn double loyalty points on every order. Unlock rewards faster.",
    code: "LOYALTY2X",
    badge: "Every Thursday",
    tone: "royal",
    cta: "Order Thursday",
    href: "/#menu",
  },
];
