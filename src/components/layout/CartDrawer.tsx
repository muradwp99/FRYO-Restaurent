"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useUI } from "@/store/ui";
import { useCart, selectTotal, selectCount } from "@/store/cart";
import { formatGBP } from "@/lib/utils";

export function CartDrawer() {
  const { cartOpen, closeCart, openFeatured } = useUI();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = useCart(selectTotal);
  const count = useCart(selectCount);

  const empty = lines.length === 0;

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      side="right"
      title={
        <>
          Your <span className="text-gold">Bag</span>
        </>
      }
      subtitle={empty ? undefined : `${count} item${count > 1 ? "s" : ""} ready to fry`}
      footer={
        empty ? undefined : (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-display text-3xl tracking-wide">
              <span className="text-cream/80">Subtotal</span>
              <span className="text-gold">{formatGBP(total)}</span>
            </div>
            <p className="text-center text-xs text-cream/40">
              Taxes & delivery calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              data-cursor="CHECKOUT"
              className="flex w-full items-center justify-center rounded-full bg-gold py-3.5 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
            >
              Checkout
            </Link>
            <button
              onClick={clear}
              className="w-full text-center text-xs uppercase tracking-widest text-cream/40 transition-colors hover:text-gold"
            >
              Clear bag
            </button>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/40">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <div>
            <p className="font-display text-3xl tracking-wide text-cream">
              Your bag is empty
            </p>
            <p className="mt-1 text-sm text-cream/50">
              Time to fix that. The grill is hot.
            </p>
          </div>
          <button
            onClick={openFeatured}
            data-cursor="FEATURED"
            className="rounded-full border border-gold/60 px-6 py-2.5 font-display text-lg tracking-widest text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Browse Featured
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {lines.map((line) => (
            <li
              key={line.lineId}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl leading-tight tracking-wide text-cream">
                    {line.name}
                  </h3>
                  <button
                    onClick={() => remove(line.lineId)}
                    aria-label={`Remove ${line.name}`}
                    data-cursor=""
                    className="text-cream/40 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {line.options && (
                  <span className="mt-0.5 line-clamp-2 text-xs text-cream/45">
                    {line.options}
                  </span>
                )}
                <span className="text-sm text-cream/50">
                  {formatGBP(line.price)} each
                </span>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setQty(line.lineId, line.qty - 1)}
                      aria-label="Decrease quantity"
                      data-cursor=""
                      className="grid h-7 w-7 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center font-display text-lg text-cream">
                      {line.qty}
                    </span>
                    <button
                      onClick={() => setQty(line.lineId, line.qty + 1)}
                      aria-label="Increase quantity"
                      data-cursor=""
                      className="grid h-7 w-7 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-xl text-gold">
                    {formatGBP(line.price * line.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
