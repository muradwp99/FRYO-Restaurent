import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";
import { MENU, type MenuItem, type MenuCategory } from "@/lib/menu";

export type MenuStatus = "Active" | "Sold out" | "Hidden";
export type AdminMenuItem = MenuItem & { status: MenuStatus };

const COLLECTION = "menu";

/** Seed from the code-level menu so the store is populated on first run. */
const seed: AdminMenuItem[] = MENU.map((m) => ({ ...m, status: m.status ?? "Active" }));

export type MenuItemInput = {
  id?: string;
  name: string;
  price: number;
  category: MenuCategory;
  tagline: string;
  description: string;
  image: string;
  badge?: MenuItem["badge"];
  featured: boolean;
  heat: 0 | 1 | 2;
  calories: number;
  rating: number;
  ingredients: string[];
  status: MenuStatus;
};

/* ── Reads ── */
export async function listMenu(): Promise<AdminMenuItem[]> {
  return readCollection<AdminMenuItem>(COLLECTION, seed);
}

export async function getMenuItem(id: string): Promise<AdminMenuItem | null> {
  const rows = await listMenu();
  return rows.find((m) => m.id === id) ?? null;
}

/** Public site: everything except Hidden. */
export async function getPublicMenu(): Promise<AdminMenuItem[]> {
  const rows = await listMenu();
  return rows.filter((m) => m.status !== "Hidden");
}

export async function getFeaturedMenu(): Promise<AdminMenuItem[]> {
  return (await getPublicMenu()).filter((m) => m.featured);
}

/* ── Writes ── */
export async function createMenuItem(input: MenuItemInput): Promise<AdminMenuItem> {
  const rows = await listMenu();
  const id = uniqueId(input.id || input.name, rows.map((r) => r.id));
  const { id: _omit, ...rest } = input;
  void _omit;
  const item: AdminMenuItem = { ...rest, id };
  await writeCollection(COLLECTION, [item, ...rows]);
  return item;
}

export async function updateMenuItem(id: string, patch: Partial<MenuItemInput>): Promise<AdminMenuItem | null> {
  const rows = await listMenu();
  let updated: AdminMenuItem | null = null;
  const next = rows.map((r) => {
    if (r.id !== id) return r;
    updated = { ...r, ...patch, id };
    return updated;
  });
  await writeCollection(COLLECTION, next);
  return updated;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const rows = await listMenu();
  await writeCollection(COLLECTION, rows.filter((r) => r.id !== id));
}
