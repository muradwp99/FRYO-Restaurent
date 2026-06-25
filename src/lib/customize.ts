export type Option = { id: string; name: string; price: number; note?: string };

export const BUNS: Option[] = [
  { id: "brioche", name: "Brioche", price: 0, note: "Buttery & soft" },
  { id: "sesame", name: "Sesame", price: 0, note: "The classic" },
  { id: "sourdough", name: "Sourdough", price: 0.5, note: "Tangy crust" },
  { id: "lettuce-wrap", name: "Lettuce Wrap", price: 0, note: "Low carb" },
];

export const SAUCES: Option[] = [
  { id: "bh-mayo", name: "B&H Mayo", price: 0 },
  { id: "bbq", name: "BBQ", price: 0 },
  { id: "algerian", name: "Algerian Hot", price: 0 },
  { id: "garlic-aioli", name: "Garlic Aioli", price: 0.4 },
  { id: "buffalo", name: "Buffalo", price: 0.4 },
];

export const SPICE = [
  { id: "mild", name: "Mild", level: 0 },
  { id: "medium", name: "Medium", level: 1 },
  { id: "hot", name: "Hot", level: 2 },
  { id: "inferno", name: "Inferno", level: 3 },
];

export const EXTRAS: Option[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 1.0 },
  { id: "smoked-bacon", name: "Smoked Bacon", price: 1.5 },
  { id: "crispy-onions", name: "Crispy Onions", price: 0.8 },
  { id: "jalapenos", name: "Jalapeños", price: 0.6 },
  { id: "extra-patty", name: "Extra Patty", price: 2.5 },
  { id: "avocado", name: "Avocado", price: 1.2 },
];

export type Config = {
  bun: string;
  sauce: string;
  spice: string;
  removed: string[]; // ingredient names
  extras: string[]; // extra ids
};

export const defaultConfig: Config = {
  bun: "brioche",
  sauce: "bh-mayo",
  spice: "medium",
  removed: [],
  extras: [],
};

export function configExtraCost(config: Config) {
  const bun = BUNS.find((b) => b.id === config.bun)?.price ?? 0;
  const sauce = SAUCES.find((s) => s.id === config.sauce)?.price ?? 0;
  const extras = config.extras.reduce(
    (sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0),
    0
  );
  return bun + sauce + extras;
}

/** human-readable one-line summary of a configuration */
export function configSummary(config: Config) {
  const bun = BUNS.find((b) => b.id === config.bun)?.name;
  const sauce = SAUCES.find((s) => s.id === config.sauce)?.name;
  const spice = SPICE.find((s) => s.id === config.spice)?.name;
  const extras = config.extras
    .map((id) => EXTRAS.find((e) => e.id === id)?.name)
    .filter(Boolean);
  const parts = [bun, sauce, spice && `${spice} spice`];
  if (extras.length) parts.push(`+ ${extras.join(", ")}`);
  if (config.removed.length) parts.push(`no ${config.removed.join(", ")}`);
  return parts.filter(Boolean).join(" · ");
}

/** stable key so identical configs stack in the cart */
export function configKey(id: string, config: Config) {
  return [
    id,
    config.bun,
    config.sauce,
    config.spice,
    [...config.removed].sort().join(","),
    [...config.extras].sort().join(","),
  ].join("|");
}
