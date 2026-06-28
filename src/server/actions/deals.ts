"use server";

import { revalidatePath } from "next/cache";
import { createDeal, updateDeal, deleteDeal, type DealInput, type DealStatus } from "@/server/deals";

function revalidateDeals() {
  revalidatePath("/"); // home DealsStrip
  revalidatePath("/deals"); // deals page
  revalidatePath("/fryo-kanji/catalog/deals"); // admin
}

export async function saveDealAction(input: DealInput) {
  const deal = input.id ? await updateDeal(input.id, input) : await createDeal(input);
  revalidateDeals();
  return { ok: true as const, id: deal?.id ?? input.id };
}

export async function deleteDealAction(id: string) {
  await deleteDeal(id);
  revalidateDeals();
  return { ok: true as const };
}

export async function setDealStatusAction(id: string, status: DealStatus) {
  await updateDeal(id, { status });
  revalidateDeals();
  return { ok: true as const };
}
