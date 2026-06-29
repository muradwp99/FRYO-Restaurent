"use server";

import { revalidatePath } from "next/cache";
import {
  updateFinanceSettings,
  updatePaymentSettings,
  setPayoutStatus,
  setRefundStatus,
  deleteRefund,
  type FinanceSettings,
  type PaymentSettings,
  type PayoutStatus,
  type RefundStatus,
} from "@/server/finance";

export async function savePaymentSettingsAction(data: PaymentSettings) {
  await updatePaymentSettings(data);
  revalidatePath("/fryo-kanji/finance/payments");
  revalidatePath("/checkout");
  return { ok: true as const };
}

export async function saveFinanceSettingsAction(data: FinanceSettings) {
  await updateFinanceSettings(data);
  revalidatePath("/fryo-kanji/finance/taxes");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { ok: true as const };
}

export async function setPayoutStatusAction(id: string, status: PayoutStatus) {
  await setPayoutStatus(id, status);
  revalidatePath("/fryo-kanji/finance/payments");
  return { ok: true as const };
}

export async function setRefundStatusAction(id: string, status: RefundStatus) {
  await setRefundStatus(id, status);
  revalidatePath("/fryo-kanji/finance/refunds");
  return { ok: true as const };
}

export async function deleteRefundAction(id: string) {
  await deleteRefund(id);
  revalidatePath("/fryo-kanji/finance/refunds");
  return { ok: true as const };
}
