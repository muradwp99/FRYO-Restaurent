"use client";

import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import { DEALS, type Deal } from "@/lib/deals";
import type { DealsBlockContent } from "@/server/content";
import { Reveal } from "@/components/anim/Reveal";
import { cn } from "@/lib/utils";

const DEALS_FALLBACK: DealsBlockContent = { eyebrow: "Save More", title: "Today's", titleAccent: "Deals", ctaLabel: "View All Deals" };

export function DealsStrip({ deals = DEALS, content = DEALS_FALLBACK }: { deals?: Deal[]; content?: DealsBlockContent }) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-display text-base tracking-[0.4em] text-gold">
              {content.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl">
              {content.title} <span className="text-gold-grad">{content.titleAccent}</span>
            </h2>
          </div>
          <Link
            href="/deals"
            data-cursor=""
            className="inline-flex items-center gap-1 font-display text-xl tracking-widest text-gold transition-colors hover:text-gold-light"
          >
            {content.ctaLabel} <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        <Reveal stagger className="grid gap-5 md:grid-cols-2">
          {deals.slice(0, 4).map((deal) => (
            <Link
              key={deal.id}
              href={deal.href}
              className="panel panel-hover group relative flex flex-col gap-3 overflow-hidden p-7"
            >
              <div
                className={cn(
                  "absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-60",
                  deal.tone === "gold" ? "bg-gold/20" : "bg-royal/40"
                )}
              />
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl",
                    deal.tone === "gold"
                      ? "bg-gold/15 text-gold"
                      : "bg-royal/40 text-cream"
                  )}
                >
                  <Tag className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "font-display text-sm tracking-widest",
                    deal.tone === "gold" ? "text-gold" : "text-cream/70"
                  )}
                >
                  {deal.badge}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-cream">
                {deal.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream/60">{deal.blurb}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md border border-dashed border-white/20 px-3 py-1 font-mono text-xs tracking-widest text-cream/80">
                  {deal.code}
                </span>
                <span className="inline-flex items-center gap-1 font-display text-lg tracking-widest text-gold">
                  {deal.cta} <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
