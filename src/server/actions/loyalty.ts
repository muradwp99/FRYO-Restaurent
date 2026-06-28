"use server";

import { revalidatePath } from "next/cache";
import {
  updateLoyaltyProgram,
  saveRule,
  setRuleStatus,
  deleteRule,
  type LoyaltyProgram,
  type RuleInput,
  type RuleStatus,
} from "@/server/loyalty";

function revalidateLoyalty() {
  revalidatePath("/fryo-kanji/people/loyalty");
}

export async function saveLoyaltyProgramAction(data: LoyaltyProgram) {
  await updateLoyaltyProgram(data);
  revalidateLoyalty();
  return { ok: true as const };
}

export async function saveRuleAction(input: RuleInput) {
  const r = await saveRule(input);
  revalidateLoyalty();
  return { ok: true as const, id: r.id };
}

export async function setRuleStatusAction(id: string, status: RuleStatus) {
  await setRuleStatus(id, status);
  revalidateLoyalty();
  return { ok: true as const };
}

export async function deleteRuleAction(id: string) {
  await deleteRule(id);
  revalidateLoyalty();
  return { ok: true as const };
}
