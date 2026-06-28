"use server";

import { revalidatePath } from "next/cache";
import { saveCustomer, deleteCustomer, type CustomerInput } from "@/server/customers";

function revalidateCustomers(id?: string) {
  revalidatePath("/fryo-kanji/customers");
  if (id) revalidatePath(`/fryo-kanji/customers/${id}`);
}

export async function saveCustomerAction(input: CustomerInput) {
  const c = await saveCustomer(input);
  revalidateCustomers(c.id);
  return { ok: true as const, id: c.id };
}

export async function deleteCustomerAction(id: string) {
  await deleteCustomer(id);
  revalidateCustomers();
  return { ok: true as const };
}
