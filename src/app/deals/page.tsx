"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, Copy, Check, ArrowRight, Truck } from "lucide-react";
import { DEALS } from "@/lib/deals";
import { Reveal } from "@/components/anim/Reveal";
import { cn } from "@/lib/utils";

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-28 md:px-10">
      <div className="mb-12">
        <span className="font-display text-base tracking-[0.4em] text-gold">
          Save More, Eat More
        </span>
        <h1 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
          The <span className="text-gold-grad">Deals</span>
        </h1>
        <p className="mt-4 max-w-md text-cream/60">
          Stack the savings. Codes apply at checkout — tap to copy.
        </p>
      </div>

      <Reveal stagger className="grid gap-5 md:grid-cols-2">
        {DEALS.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </Reveal>

      {/* banner */}
      <Reveal className="mt-6 overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-10 text-center md:p-16">
        <Truck className="mx-auto h-10 w-10 text-gold" />
        <h2 className="mt-4 font-display text-5xl leading-none text-cream md:text-7xl">
          Free Delivery <span className="text-gold-grad">Over £20</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/60">
          No code needed. Just build your order over £20 and the delivery fee
          disappears automatically at checkout.
        </p>
        <Link
          href="/#menu"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
        >
          Order Now <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </div>
  );
}

function DealCard({ deal }: { deal: (typeof DEALS)[number] }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(deal.code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="panel panel-hover group relative flex flex-col gap-3 overflow-hidden p-8">
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl",
          deal.tone === "gold" ? "bg-gold/20" : "bg-royal/40"
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl",
            deal.tone === "gold" ? "bg-gold/15 text-gold" : "bg-royal/40 text-cream"
          )}
        >
          <Tag className="h-5 w-5" />
        </span>
        <span className="font-display text-sm tracking-widest text-gold">
          {deal.badge}
        </span>
      </div>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-cream">
        {deal.title}
      </h3>
      <p className="text-sm leading-relaxed text-cream/60">{deal.blurb}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <button
          onClick={copy}
          data-cursor=""
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/25 px-3 py-1.5 font-mono text-xs tracking-widest text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : deal.code}
        </button>
        <Link
          href={deal.href}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-5 py-2.5 font-display text-lg tracking-widest transition-all",
            deal.tone === "gold"
              ? "bg-gold text-navy hover:bg-gold-light"
              : "border border-gold/60 text-gold hover:bg-gold hover:text-navy"
          )}
        >
          {deal.cta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
