"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./cart";

export type Order = {
  id: string;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  total: number;
  name: string;
  address: string;
  method: "delivery" | "collection";
  placedAt: number;
};

type OrderState = {
  last: Order | null;
  place: (order: Omit<Order, "id" | "placedAt">) => Order;
};

function makeId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < 6; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return `FRYO-${s}`;
}

export const useOrder = create<OrderState>()(
  persist(
    (set) => ({
      last: null,
      place: (order) => {
        const full: Order = { ...order, id: makeId(), placedAt: Date.now() };
        set({ last: full });
        return full;
      },
    }),
    { name: "fryo-last-order" }
  )
);

export const DELIVERY_FEE = 2.49;
export const FREE_DELIVERY_OVER = 20;
