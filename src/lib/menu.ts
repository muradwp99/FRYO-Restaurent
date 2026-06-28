/** Category name — open string so the admin can add new categories beyond the originals. */
export type MenuCategory = string;

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  tagline: string;
  description: string;
  image: string;
  badge?: "Signature" | "Spicy" | "BBQ" | "Classic";
  featured?: boolean;
  heat: 0 | 1 | 2;
  calories: number;
  rating: number;
  /** removable ingredients on the customize page */
  ingredients: string[];
  /** CMS publish state — controls public visibility ("Hidden" = not shown on site) */
  status?: "Active" | "Sold out" | "Hidden";
};

export const MENU: MenuItem[] = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    price: 3.99,
    category: "Burgers",
    tagline: "The one that started it all.",
    description:
      "Top bun with B&H mayo & 3 pickles. Bottom bun with B&H mayo, crisp lettuce and a seared fillet.",
    image: "/products/assembled.webp",
    badge: "Classic",
    featured: true,
    heat: 0,
    calories: 540,
    rating: 4.7,
    ingredients: ["Lettuce", "Pickles", "B&H Mayo", "Fillet"],
  },
  {
    id: "classic-wrap",
    name: "Classic Wrap",
    price: 3.5,
    category: "Wraps",
    tagline: "Rolled, toasted, loaded.",
    description:
      "Toasted 25cm wrap with B&H mayo, lettuce, 3 pickles and 2 golden tenders.",
    image: "/products/stack.webp",
    badge: "Classic",
    featured: true,
    heat: 0,
    calories: 610,
    rating: 4.6,
    ingredients: ["Lettuce", "Pickles", "B&H Mayo", "Tenders"],
  },
  {
    id: "super-charger-burger",
    name: "Super Charger Burger",
    price: 5.99,
    category: "Burgers",
    tagline: "Algerian sauce. Maximum voltage.",
    description:
      "Top bun with Algerian sauce, 3 rings & slaw. Bottom bun with Algerian sauce, lettuce, fillet and a hot shake.",
    image: "/products/build.webp",
    badge: "Spicy",
    featured: true,
    heat: 2,
    calories: 720,
    rating: 4.9,
    ingredients: ["Lettuce", "Slaw", "Onion Rings", "Algerian Sauce", "Fillet"],
  },
  {
    id: "super-charger-wrap",
    name: "Super Charger Wrap",
    price: 4.99,
    category: "Wraps",
    tagline: "Fully charged, fully wrapped.",
    description:
      "Large 25cm toasted tortilla with Algerian sauce, lettuce, slaw, 2 tenders and a hot shake.",
    image: "/products/explode.webp",
    badge: "Spicy",
    featured: true,
    heat: 2,
    calories: 690,
    rating: 4.8,
    ingredients: ["Lettuce", "Slaw", "Algerian Sauce", "Tenders"],
  },
  {
    id: "bbq-burger",
    name: "BBQ Burger",
    price: 5.99,
    category: "Burgers",
    tagline: "Low, slow and smoky.",
    description:
      "Top bun with BBQ sauce & 3 pickles. Bottom bun with B&H mayo, lettuce, fillet and BBQ seasoning.",
    image: "/products/assembled.webp",
    badge: "BBQ",
    featured: true,
    heat: 1,
    calories: 660,
    rating: 4.8,
    ingredients: ["Lettuce", "Pickles", "BBQ Sauce", "B&H Mayo", "Fillet"],
  },
  {
    id: "bbq-wrap",
    name: "BBQ Wrap",
    price: 4.5,
    category: "Wraps",
    tagline: "Smoke it. Roll it. Devour it.",
    description:
      "Toasted wrap with B&H mayo, lettuce, 2 tenders, BBQ seasoning, BBQ sauce and 3 pickles.",
    image: "/products/stack.webp",
    badge: "BBQ",
    featured: true,
    heat: 1,
    calories: 630,
    rating: 4.7,
    ingredients: ["Lettuce", "Pickles", "BBQ Sauce", "B&H Mayo", "Tenders"],
  },
];

export const FEATURED = MENU.filter((m) => m.featured);

export function getItem(id: string) {
  return MENU.find((m) => m.id === id);
}
