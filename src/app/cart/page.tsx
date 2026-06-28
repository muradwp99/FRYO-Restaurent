"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, selectTotal, selectCount } from "@/store/cart";
import { useDeliveryConfig } from "@/lib/useDeliveryConfig";
import { formatGBP } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectTotal);
  const count = useCart(selectCount);
  const { deliveryFee: DELIVERY_FEE, freeDeliveryOver: FREE_DELIVERY_OVER } = useDeliveryConfig();

  const delivery = subtotal >= FREE_DELIVERY_OVER || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const empty = !mounted || lines.length === 0;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 md:px-10">
      <Link
        href="/#menu"
        className="mb-6 inline-flex items-center gap-2 text-sm tracking-widest text-cream/60 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Keep shopping
      </Link>

      <h1 className="font-display text-6xl leading-none text-cream md:text-8xl">
        Your <span className="text-gold-grad">Bag</span>
      </h1>
      {mounted && !empty && (
        <p className="mt-2 text-cream/55">
          {count} item{count > 1 ? "s" : ""} ready to fry.
        </p>
      )}

      {empty ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-5 rounded-3xl border border-white/10 bg-white/[0.02] py-24 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/40">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <p className="font-display text-3xl tracking-wide text-cream">
            {mounted ? "Your bag is empty" : "Loading your bag…"}
          </p>
          <Link
            href="/#menu"
            className="rounded-full bg-gold px-7 py-3 font-display text-xl tracking-widest text-navy transition-colors hover:bg-gold-light"
          >
            Browse The Menu
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* lines */}
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li
                key={line.lineId}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-2xl leading-tight tracking-wide text-cream">
                      {line.name}
                    </h3>
                    <button
                      onClick={() => remove(line.lineId)}
                      data-cursor=""
                      aria-label="Remove"
                      className="text-cream/40 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {line.options && (
                    <p className="mt-0.5 text-xs text-cream/45">{line.options}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                      <button
                        onClick={() => setQty(line.lineId, line.qty - 1)}
                        data-cursor=""
                        aria-label="Decrease"
                        className="grid h-8 w-8 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center font-display text-lg text-cream">
                        {line.qty}
                      </span>
                      <button
                        onClick={() => setQty(line.lineId, line.qty + 1)}
                        data-cursor=""
                        aria-label="Increase"
                        className="grid h-8 w-8 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display text-2xl text-gold">
                      {formatGBP(line.price * line.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            <button
              onClick={clear}
              className="self-start text-xs uppercase tracking-widest text-cream/40 transition-colors hover:text-gold"
            >
              Clear bag
            </button>
          </ul>

          {/* summary */}
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-3xl tracking-wide text-cream">Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={formatGBP(subtotal)} />
              <Row
                label="Delivery"
                value={delivery === 0 ? "Free" : formatGBP(delivery)}
                accent={delivery === 0}
              />
              {delivery > 0 && (
                <p className="text-xs text-cream/45">
                  Add {formatGBP(FREE_DELIVERY_OVER - subtotal)} more for free delivery.
                </p>
              )}
              <div className="hairline my-2" />
              <div className="flex items-center justify-between font-display text-3xl tracking-wide">
                <span className="text-cream/80">Total</span>
                <span className="text-gold">{formatGBP(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              data-cursor="CHECKOUT"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
            >
              Checkout <ArrowRight className="h-5 w-5" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-cream/60">{label}</span>
      <span className={accent ? "text-gold" : "text-cream/90"}>{value}</span>
    </div>
  );
}
