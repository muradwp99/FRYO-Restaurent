"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { InteractiveGlow } from "@/components/anim/InteractiveGlow";

type QA = { q: string; a: string };

const DEFAULT_FAQ: QA[] = [
  { q: "What are your delivery areas & times?", a: "We deliver across the city, daily from 11:00 to 23:00. Live tracking kicks in the moment your order hits the kitchen." },
  { q: "Can I customise my burger or wrap?", a: "Every build is yours to shape — swap the bun, dial the spice, drop ingredients or pile on extras right from the item page." },
  { q: "Do you cater for allergies?", a: "Each item lists its ingredients and allergens. If you're unsure, give us a call before ordering and we'll talk you through it." },
  { q: "How do refunds work?", a: "Something not right? Reach out with your order number and we'll sort a refund or remake — no fuss." },
];

export function FAQ({
  eyebrow = "Good To Know",
  title = "Questions, Answered",
  items = DEFAULT_FAQ,
}: {
  eyebrow?: string;
  title?: string;
  items?: QA[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-20 md:py-28">
      <InteractiveGlow />
      <div className="relative mx-auto max-w-[820px] px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="font-display text-base tracking-[0.4em] text-gold">{eyebrow}</span>
          <h2 className="mt-2 font-display text-4xl leading-none text-cream md:text-6xl">{title}</h2>
        </div>

        <Reveal stagger className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <span className="font-display text-xl tracking-wide text-cream">{item.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-cream/60">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
