"use client";

import { MousePointerClick, SlidersHorizontal, ShoppingBag, Bike } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { TextReveal } from "@/components/anim/TextReveal";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Pick Your Build",
    body: "Browse six signature burgers and wraps, each one stacked to order.",
  },
  {
    icon: SlidersHorizontal,
    title: "Make It Yours",
    body: "Swap the bun, dial the spice, drop ingredients and pile on extras.",
  },
  {
    icon: ShoppingBag,
    title: "Drop It In The Bag",
    body: "Build your order, review your bag and breeze through checkout.",
  },
  {
    icon: Bike,
    title: "Fired & Delivered",
    body: "We fry it fresh and track it to your door in real time.",
  },
];

export function Steps() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-14 text-center">
          <span className="font-display text-base tracking-[0.4em] text-gold">
            How It Works
          </span>
          <TextReveal
            as="h2"
            by="words"
            className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl"
          >
            Four Steps To Flavour
          </TextReveal>
        </div>

        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="panel panel-hover group relative overflow-hidden p-7"
            >
              <span className="absolute -right-4 -top-6 font-display text-8xl text-white/[0.04]">
                {i + 1}
              </span>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-3xl tracking-wide text-cream">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">{s.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
