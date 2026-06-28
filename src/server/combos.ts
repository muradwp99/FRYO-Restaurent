import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type ComboStatus = "Active" | "Hidden";
export type Combo = {
  id: string;
  name: string;
  description: string;
  items: string;
  price: string;
  status: ComboStatus;
};

const COLLECTION = "combos";

const seed: Combo[] = [
  { id: "meal4less", name: "Meal Deal — Burger + Drink + Fries", description: "Any burger, loaded fries and a drink.", items: "Burger · Fries · Drink", price: "£10.99", status: "Active" },
  { id: "wrap-combo", name: "Wrap & Roll", description: "Any wrap with fries and a soft drink.", items: "Wrap · Fries · Drink", price: "£9.99", status: "Active" },
  { id: "family-box", name: "Family Box", description: "Four builds, two large fries and four drinks.", items: "4× Build · 2× Large Fries · 4× Drink", price: "£34.99", status: "Hidden" },
];

export type ComboInput = Omit<Combo, "id"> & { id?: string };

export async function listCombos(): Promise<Combo[]> {
  return readCollection<Combo>(COLLECTION, seed);
}

export async function saveCombo(input: ComboInput): Promise<Combo> {
  const rows = await listCombos();
  if (input.id) {
    let updated: Combo | null = null;
    const next = rows.map((c) => {
      if (c.id !== input.id) return c;
      updated = { ...c, ...input, id: c.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "combo", rows.map((c) => c.id));
  const combo: Combo = { ...input, id };
  await writeCollection(COLLECTION, [...rows, combo]);
  return combo;
}

export async function deleteCombo(id: string): Promise<void> {
  const rows = await listCombos();
  await writeCollection(COLLECTION, rows.filter((c) => c.id !== id));
}
