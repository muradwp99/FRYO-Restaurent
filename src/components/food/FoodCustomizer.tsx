"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  ArrowLeft,
  Flame,
  Star,
  Minus,
  Plus,
  Check,
  ShoppingBag,
} from "lucide-react";
import type { MenuItem } from "@/lib/menu";
import {
  BUNS,
  SAUCES,
  SPICE,
  EXTRAS,
  type Config,
  configExtraCost,
  configSummary,
  configKey,
} from "@/lib/customize";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { formatGBP, cn } from "@/lib/utils";

export function FoodCustomizer({ item }: { item: MenuItem }) {
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const rootRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<Config>({
    bun: "brioche",
    sauce: "bh-mayo",
    spice: item.heat === 2 ? "hot" : item.heat === 1 ? "medium" : "mild",
    removed: [],
    extras: [],
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = item.price + configExtraCost(config);
  const total = unitPrice * qty;

  const heat = useMemo(
    () => SPICE.find((s) => s.id === config.spice)?.level ?? 1,
    [config.spice]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".fc-reveal", { autoAlpha: 0, y: 30 });
      gsap.to(".fc-reveal", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const toggle = (key: "removed" | "extras", value: string) =>
    setConfig((c) => ({
      ...c,
      [key]: c[key].includes(value)
        ? c[key].filter((v) => v !== value)
        : [...c[key], value],
    }));

  const onAdd = () => {
    add({
      id: item.id,
      name: item.name,
      price: unitPrice,
      image: item.image,
      options: configSummary(config),
      lineId: configKey(item.id, config),
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    openCart();
  };

  return (
    <div ref={rootRef} className="mx-auto max-w-[1400px] px-5 pb-28 pt-28 md:px-10">
      <Link
        href="/#menu"
        className="fc-reveal mb-6 inline-flex items-center gap-2 text-sm tracking-widest text-cream/60 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* LEFT — visual */}
        <div className="fc-reveal lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-royal/20 to-ink">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
            {item.badge && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-gold px-3 py-1 font-display text-sm tracking-widest text-navy">
                {item.badge}
              </span>
            )}
            <div className="relative aspect-square">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Rating", value: `${item.rating}★` },
              { label: "Calories", value: `${item.calories}` },
              {
                label: "Spice",
                value: ["Mild", "Medium", "Hot", "Inferno"][heat],
              },
            ].map((s) => (
              <div
                key={s.label}
                className="panel flex flex-col items-center py-4 text-center"
              >
                <span className="font-display text-2xl text-gold">{s.value}</span>
                <span className="mt-1 text-[10px] uppercase tracking-widest text-cream/45">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — options */}
        <div>
          <div className="fc-reveal">
            <h1 className="font-display text-5xl leading-none tracking-wide text-cream md:text-6xl">
              {item.name}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/60">
              {item.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-cream/60">
              <span className="flex items-center gap-1 text-gold">
                <Star className="h-4 w-4 fill-gold" /> {item.rating}
              </span>
              <span>{item.calories} kcal</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < heat ? "fill-gold text-gold" : "text-cream/20"
                    )}
                  />
                ))}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-7">
            {/* Bun */}
            <Group title="Choose Your Bun">
              <Chips
                options={BUNS.map((b) => ({
                  id: b.id,
                  label: b.name,
                  note: b.note,
                  price: b.price,
                }))}
                value={config.bun}
                onSelect={(id) => setConfig((c) => ({ ...c, bun: id }))}
              />
            </Group>

            {/* Sauce */}
            <Group title="Choose Your Sauce">
              <Chips
                options={SAUCES.map((s) => ({
                  id: s.id,
                  label: s.name,
                  price: s.price,
                }))}
                value={config.sauce}
                onSelect={(id) => setConfig((c) => ({ ...c, sauce: id }))}
              />
            </Group>

            {/* Spice */}
            <Group title="Spice Level">
              <div className="flex gap-2">
                {SPICE.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setConfig((c) => ({ ...c, spice: s.id }))}
                    data-cursor=""
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-3 font-display text-lg tracking-wider transition-all",
                      config.spice === s.id
                        ? "border-gold bg-gold text-navy"
                        : "border-white/10 bg-white/[0.03] text-cream/70 hover:border-gold/40"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </Group>

            {/* Remove ingredients */}
            <Group title="Remove Ingredients">
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing) => {
                  const off = config.removed.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => toggle("removed", ing)}
                      data-cursor=""
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all",
                        off
                          ? "border-red-400/40 bg-red-400/10 text-red-300/80 line-through"
                          : "border-white/10 bg-white/[0.03] text-cream/80 hover:border-gold/40"
                      )}
                    >
                      {ing}
                    </button>
                  );
                })}
              </div>
            </Group>

            {/* Extras */}
            <Group title="Add Extras">
              <div className="grid gap-2 sm:grid-cols-2">
                {EXTRAS.map((e) => {
                  const on = config.extras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggle("extras", e.id)}
                      data-cursor=""
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                        on
                          ? "border-gold bg-gold/10"
                          : "border-white/10 bg-white/[0.03] hover:border-gold/40"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "grid h-5 w-5 place-items-center rounded-md border",
                            on
                              ? "border-gold bg-gold text-navy"
                              : "border-white/20 text-transparent"
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-cream/85">{e.name}</span>
                      </span>
                      <span className="font-display text-base text-gold">
                        +{formatGBP(e.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Group>
          </div>
        </div>
      </div>

      {/* sticky add-to-order bar */}
      <div className="fc-reveal sticky bottom-4 z-30 mt-8">
        <div className="mx-auto flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink-2/90 p-3 backdrop-blur-xl md:p-4">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
              data-cursor=""
              className="grid h-9 w-9 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-display text-xl text-cream">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase"
              data-cursor=""
              className="grid h-9 w-9 place-items-center rounded-full text-cream transition-colors hover:bg-gold hover:text-navy"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden flex-col text-right sm:flex">
            <span className="text-[10px] uppercase tracking-widest text-cream/45">
              Unit {formatGBP(unitPrice)}
            </span>
          </div>

          <button
            onClick={onAdd}
            data-cursor="ADD"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-display text-xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)] sm:flex-none sm:px-8"
          >
            {added ? (
              <>
                <Check className="h-5 w-5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" /> Add to Order · {formatGBP(total)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fc-reveal">
      <h2 className="mb-3 font-display text-xl tracking-[0.2em] text-cream/90">
        {title}
      </h2>
      {children}
    </div>
  );
}

type ChipOpt = { id: string; label: string; note?: string; price: number };

function Chips({
  options,
  value,
  onSelect,
}: {
  options: ChipOpt[];
  value: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          data-cursor=""
          className={cn(
            "rounded-xl border px-4 py-2.5 text-left transition-all",
            value === o.id
              ? "border-gold bg-gold/10"
              : "border-white/10 bg-white/[0.03] hover:border-gold/40"
          )}
        >
          <span className="flex items-center gap-2 text-sm text-cream/90">
            {o.label}
            {o.price > 0 && (
              <span className="font-display text-gold">+{formatGBP(o.price)}</span>
            )}
          </span>
          {o.note && (
            <span className="block text-[10px] uppercase tracking-widest text-cream/40">
              {o.note}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
