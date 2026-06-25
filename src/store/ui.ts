"use client";

import { create } from "zustand";

type UIState = {
  featuredOpen: boolean;
  cartOpen: boolean;
  navOpen: boolean; // mobile nav
  openFeatured: () => void;
  closeFeatured: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleNav: () => void;
  closeNav: () => void;
  closeAll: () => void;
};

export const useUI = create<UIState>((set) => ({
  featuredOpen: false,
  cartOpen: false,
  navOpen: false,
  openFeatured: () => set({ featuredOpen: true, cartOpen: false }),
  closeFeatured: () => set({ featuredOpen: false }),
  openCart: () => set({ cartOpen: true, featuredOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  closeNav: () => set({ navOpen: false }),
  closeAll: () => set({ featuredOpen: false, cartOpen: false, navOpen: false }),
}));
