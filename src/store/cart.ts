"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  lineId: string; // unique per (item + configuration)
  id: string; // product id
  name: string;
  price: number; // unit price incl. customisation
  image: string;
  qty: number;
  options?: string; // human-readable customisation summary
};

type AddInput = {
  id: string;
  name: string;
  price: number;
  image: string;
  options?: string;
  lineId?: string;
  qty?: number;
};

type CartState = {
  lines: CartLine[];
  add: (item: AddInput) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (item) =>
        set((state) => {
          const lineId = item.lineId ?? item.id;
          const qty = item.qty ?? 1;
          const existing = state.lines.find((l) => l.lineId === lineId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.lineId === lineId ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                lineId,
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                options: item.options,
                qty,
              },
            ],
          };
        }),
      remove: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
      setQty: (lineId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.lineId !== lineId)
              : state.lines.map((l) => (l.lineId === lineId ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "fryo-cart" }
  )
);

export const selectCount = (s: CartState) =>
  s.lines.reduce((n, l) => n + l.qty, 0);
export const selectTotal = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.qty * l.price, 0);
