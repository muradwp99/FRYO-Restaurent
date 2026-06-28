import "server-only";
import { readObject, writeObject, readCollection, writeCollection, uniqueId } from "./store";

/* ── Program settings ── */
export type LoyaltyProgram = {
  pointsPerPound: number;
  rewardThreshold: number;
  rewardLabel: string;
};

const PROGRAM_FILE = "loyalty-program";
const PROGRAM_DEFAULT: LoyaltyProgram = { pointsPerPound: 1, rewardThreshold: 100, rewardLabel: "£5 off your next order" };

export async function getLoyaltyProgram(): Promise<LoyaltyProgram> {
  const p = await readObject<Partial<LoyaltyProgram>>(PROGRAM_FILE, PROGRAM_DEFAULT);
  return { ...PROGRAM_DEFAULT, ...p };
}

export async function updateLoyaltyProgram(data: LoyaltyProgram): Promise<void> {
  await writeObject(PROGRAM_FILE, data);
}

/* ── Rules ── */
export type RuleType = "Multiplier" | "Bonus Points" | "Earn Rate";
export type RuleStatus = "Active" | "Paused";
export type LoyaltyRule = {
  id: string;
  name: string;
  type: RuleType;
  value: number;
  schedule: string;
  status: RuleStatus;
};

const RULES = "loyalty-rules";
const ruleSeed: LoyaltyRule[] = [
  { id: "double-thursday", name: "Double Points Thursday", type: "Multiplier", value: 2, schedule: "Every Thursday", status: "Active" },
  { id: "welcome-bonus", name: "Welcome Bonus", type: "Bonus Points", value: 50, schedule: "First order", status: "Active" },
  { id: "weekend-boost", name: "Weekend Boost", type: "Multiplier", value: 1.5, schedule: "Sat – Sun", status: "Paused" },
];

export type RuleInput = Omit<LoyaltyRule, "id"> & { id?: string };

export async function listRules(): Promise<LoyaltyRule[]> {
  return readCollection<LoyaltyRule>(RULES, ruleSeed);
}

export async function saveRule(input: RuleInput): Promise<LoyaltyRule> {
  const rows = await listRules();
  if (input.id) {
    let updated: LoyaltyRule | null = null;
    const next = rows.map((r) => {
      if (r.id !== input.id) return r;
      updated = { ...r, ...input, id: r.id };
      return updated;
    });
    await writeCollection(RULES, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "rule", rows.map((r) => r.id));
  const rule: LoyaltyRule = { ...input, id };
  await writeCollection(RULES, [...rows, rule]);
  return rule;
}

export async function setRuleStatus(id: string, status: RuleStatus): Promise<void> {
  const rows = await listRules();
  await writeCollection(RULES, rows.map((r) => (r.id === id ? { ...r, status } : r)));
}

export async function deleteRule(id: string): Promise<void> {
  const rows = await listRules();
  await writeCollection(RULES, rows.filter((r) => r.id !== id));
}
