"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ShoppingBag } from "lucide-react";
import { useCart, selectCount, selectTotal } from "@/store/cart";
import { useUI } from "@/store/ui";
import { formatGBP } from "@/lib/utils";

export function FloatingCart() {
  const pathname = usePathname();
  const openCart = useUI((s) => s.openCart);
  const count = useCart(selectCount);
  const total = useCart(selectTotal);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const prevCount = useRef(0);

  useEffect(() => setMounted(true), []);

  // pop when items are added
  useEffect(() => {
    if (!mounted) return;
    if (count > prevCount.current && btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.85 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
      );
    }
    prevCount.current = count;
  }, [count, mounted]);

  // hidden on cart/checkout (they have their own summaries) and when empty
  const hidden =
    !mounted ||
    count === 0 ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/order-confirmed";

  if (hidden) return null;

  return (
    <button
      ref={btnRef}
      onClick={openCart}
      data-cursor="CART"
      aria-label="Open cart"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-gold/40 bg-ink-2/90 py-2.5 pl-3 pr-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform hover:scale-[1.03] md:bottom-8 md:right-8"
    >
      <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gold text-navy">
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-navy px-1 font-display text-xs text-gold">
          {count}
        </span>
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] uppercase tracking-widest text-cream/50">
          Your bag
        </span>
        <span className="font-display text-xl tracking-wide text-cream">
          {formatGBP(total)}
        </span>
      </span>
    </button>
  );
}
