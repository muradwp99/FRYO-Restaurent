"use client";

import Image from "next/image";
import { Flame } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { useUI } from "@/store/ui";
import { FEATURED } from "@/lib/menu";
import { formatGBP } from "@/lib/utils";

export function FeaturedDrawer() {
  const { featuredOpen, closeFeatured, openCart } = useUI();

  return (
    <Drawer
      open={featuredOpen}
      onClose={closeFeatured}
      side="left"
      title={
        <>
          Featured <span className="text-gold">Eats</span>
        </>
      }
      subtitle="Straight off the grill — tap add to drop one in your bag."
      footer={
        <button
          onClick={openCart}
          data-cursor="CART"
          className="flex w-full items-center justify-center rounded-full bg-gold py-3 font-display text-xl tracking-widest text-navy transition-colors hover:bg-gold-light"
        >
          View Bag
        </button>
      }
    >
      <ul className="flex flex-col gap-4">
        {FEATURED.map((item) => (
          <li
            key={item.id}
            className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-gold/40"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.heat === 2 && (
                <span className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-navy/80 text-gold">
                  <Flame className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl leading-none tracking-wide text-cream">
                  {item.name}
                </h3>
                <span className="font-display text-2xl leading-none text-gold">
                  {formatGBP(item.price)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-cream/55">
                {item.tagline}
              </p>
              <div className="mt-auto pt-2">
                <AddToCartButton
                  item={item}
                  className="px-4 py-1.5 text-sm"
                  label="Add to cart"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}
