"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus, deleteOrder, createOrder, type OrderStatus } from "@/server/orders";

function revalidateOrders(id?: string) {
  revalidatePath("/fryo-kanji/orders");
  revalidatePath("/fryo-kanji/order-tracking"); // live board
  revalidatePath("/fryo-kanji"); // dashboard recent orders
  if (id) revalidatePath(`/fryo-kanji/orders/${id}`);
}

export async function createOrderAction(input: { id: string; customer: string; items: string; amount: string; payment?: string }) {
  await createOrder(input);
  revalidateOrders(input.id);
  return { ok: true as const };
}

export async function setOrderStatusAction(id: string, status: OrderStatus) {
  await updateOrderStatus(id, status);
  revalidateOrders(id);
  return { ok: true as const };
}

export async function deleteOrderAction(id: string) {
  await deleteOrder(id);
  revalidateOrders();
  return { ok: true as const };
}
