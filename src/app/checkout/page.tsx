"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bike, Store, CreditCard, Lock } from "lucide-react";
import { useCart, selectTotal } from "@/store/cart";
import { useOrder } from "@/store/order";
import { useDeliveryConfig } from "@/lib/useDeliveryConfig";
import { createOrderAction } from "@/server/actions/orders";
import { formatGBP, cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectTotal);
  const place = useOrder((s) => s.place);
  const { deliveryFee: DELIVERY_FEE, freeDeliveryOver: FREE_DELIVERY_OVER } = useDeliveryConfig();

  const [method, setMethod] = useState<"delivery" | "collection">("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  const delivery = method === "collection" || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const empty = mounted && lines.length === 0;

  const onPlace = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    const placed = place({
      lines,
      subtotal,
      delivery,
      total,
      name: name || "Guest",
      address: method === "delivery" ? address : "Collection — 42 Flame Street",
      method,
    });
    // Persist into the admin order pipeline (fire-and-forget; UX shouldn't block on it).
    const itemsSummary = lines.map((l) => `${l.name} ×${l.qty}`).join(", ");
    void createOrderAction({
      id: placed.id,
      customer: name || "Guest",
      items: itemsSummary || "—",
      amount: formatGBP(total),
    }).catch(() => {});
    clear();
    router.push("/order-confirmed");
  };

  if (empty) {
    return (
      <div className="mx-auto max-w-[700px] px-5 pb-24 pt-36 text-center">
        <h1 className="font-display text-5xl text-cream">Nothing to check out</h1>
        <p className="mt-3 text-cream/55">Your bag is empty — let&apos;s fix that.</p>
        <Link
          href="/#menu"
          className="mt-8 inline-flex rounded-full bg-gold px-7 py-3 font-display text-xl tracking-widest text-navy hover:bg-gold-light"
        >
          Browse The Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 md:px-10">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-2 text-sm tracking-widest text-cream/60 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to bag
      </Link>
      <h1 className="font-display text-6xl leading-none text-cream md:text-8xl">
        Check<span className="text-gold-grad">out</span>
      </h1>

      <form onSubmit={onPlace} className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* form side */}
        <div className="space-y-6">
          {/* method */}
          <section className="panel p-6">
            <h2 className="mb-4 font-display text-2xl tracking-wide text-cream">
              How would you like it?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "delivery", label: "Delivery", icon: Bike },
                { id: "collection", label: "Collection", icon: Store },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id as "delivery" | "collection")}
                  data-cursor=""
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all",
                    method === m.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-white/[0.03] hover:border-gold/40"
                  )}
                >
                  <m.icon className={cn("h-6 w-6", method === m.id ? "text-gold" : "text-cream/60")} />
                  <span className="font-display text-xl tracking-wide text-cream">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* details */}
          <section className="panel p-6">
            <h2 className="mb-4 font-display text-2xl tracking-wide text-cream">
              Your details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="input-base"
                />
              </Field>
              <Field label="Phone">
                <input required type="tel" placeholder="+44…" className="input-base" />
              </Field>
              {method === "delivery" && (
                <div className="sm:col-span-2">
                  <Field label="Delivery address">
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="12 Baker Street, London, E1 6RF"
                      className="input-base"
                    />
                  </Field>
                </div>
              )}
            </div>
          </section>

          {/* payment (demo) */}
          <section className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide text-cream">Payment</h2>
              <span className="flex items-center gap-1 text-xs text-cream/45">
                <Lock className="h-3.5 w-3.5" /> Demo — no real charge
              </span>
            </div>
            <div className="grid gap-4">
              <Field label="Card number" icon={<CreditCard className="h-4 w-4" />}>
                <input placeholder="4242 4242 4242 4242" className="input-base" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry">
                  <input placeholder="MM/YY" className="input-base" />
                </Field>
                <Field label="CVC">
                  <input placeholder="123" className="input-base" />
                </Field>
              </div>
            </div>
          </section>
        </div>

        {/* summary side */}
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl tracking-wide text-cream">Order</h2>
          <ul className="mt-5 space-y-3">
            {lines.map((l) => (
              <li key={l.lineId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 font-display text-xs text-navy">
                    {l.qty}
                  </span>
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-cream/85">{l.name}</span>
                <span className="font-display text-base text-gold">
                  {formatGBP(l.price * l.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="hairline my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-cream/70">
              <span>Subtotal</span>
              <span>{formatGBP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream/70">
              <span>Delivery</span>
              <span className={delivery === 0 ? "text-gold" : ""}>
                {delivery === 0 ? "Free" : formatGBP(delivery)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between font-display text-3xl tracking-wide">
              <span className="text-cream/80">Total</span>
              <span className="text-gold">{formatGBP(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={placing}
            data-cursor="ORDER"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-gold py-3.5 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)] disabled:opacity-60"
          >
            {placing ? "Placing…" : `Place Order · ${formatGBP(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-widest text-cream/50">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
