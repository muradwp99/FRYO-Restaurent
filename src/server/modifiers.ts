import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";
import { BUNS, SAUCES, SPICE, EXTRAS, type Option } from "@/lib/customize";

export type SelectionType = "single" | "multi";

export type ModifierOption = {
  id: string;
  label: string;
  priceDelta: number;
  note?: string;
  level?: number; // spice only
  soldOut?: boolean;
};

export type ModifierGroup = {
  id: string;
  name: string;
  selectionType: SelectionType;
  required: boolean;
  min: number;
  max: number;
  options: ModifierOption[];
};

const COLLECTION = "modifiers";

const toOpt = (o: Option): ModifierOption => ({ id: o.id, label: o.name, priceDelta: o.price, note: o.note });

const seed: ModifierGroup[] = [
  { id: "bun", name: "Choose Your Bun", selectionType: "single", required: true, min: 1, max: 1, options: BUNS.map(toOpt) },
  { id: "sauce", name: "Choose Your Sauce", selectionType: "single", required: true, min: 1, max: 1, options: SAUCES.map(toOpt) },
  {
    id: "spice",
    name: "Spice Level",
    selectionType: "single",
    required: true,
    min: 1,
    max: 1,
    options: SPICE.map((s) => ({ id: s.id, label: s.name, priceDelta: 0, level: s.level })),
  },
  { id: "extras", name: "Add Extras", selectionType: "multi", required: false, min: 0, max: 99, options: EXTRAS.map(toOpt) },
];

export async function listModifierGroups(): Promise<ModifierGroup[]> {
  return readCollection<ModifierGroup>(COLLECTION, seed);
}

export type ModifierGroupInput = Omit<ModifierGroup, "id"> & { id?: string };

export async function saveModifierGroup(input: ModifierGroupInput): Promise<ModifierGroup> {
  const rows = await listModifierGroups();
  // normalise option ids
  const options = input.options.map((o) => ({
    ...o,
    id: o.id || uniqueId(o.label, []),
    priceDelta: Number(o.priceDelta) || 0,
  }));
  if (input.id) {
    let updated: ModifierGroup | null = null;
    const next = rows.map((g) => {
      if (g.id !== input.id) return g;
      updated = { ...g, ...input, options, id: g.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "group", rows.map((g) => g.id));
  const group: ModifierGroup = { ...input, options, id };
  await writeCollection(COLLECTION, [...rows, group]);
  return group;
}

export async function deleteModifierGroup(id: string): Promise<void> {
  const rows = await listModifierGroups();
  await writeCollection(COLLECTION, rows.filter((g) => g.id !== id));
}

/** Shape the global modifier groups for the public FoodCustomizer. */
export async function getCustomizeOptions() {
  const groups = await listModifierGroups();
  const find = (id: string) => groups.find((g) => g.id === id)?.options ?? [];
  const toPublic = (o: ModifierOption): Option => ({ id: o.id, name: o.label, price: o.priceDelta, note: o.note });
  return {
    buns: find("bun").map(toPublic),
    sauces: find("sauce").map(toPublic),
    spice: find("spice").map((o) => ({ id: o.id, name: o.label, level: o.level ?? 0 })),
    extras: find("extras").map(toPublic),
  };
}

export type CustomizeOptions = Awaited<ReturnType<typeof getCustomizeOptions>>;
