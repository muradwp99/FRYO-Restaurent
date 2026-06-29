"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { MENU, type MenuItem } from "@/lib/menu";
import type { MenuSectionContent } from "@/server/content";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { formatGBP, cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  Classic: "bg-cream/10 text-cream",
  Spicy: "bg-gold/15 text-gold",
  BBQ: "bg-royal/40 text-cream",
  Signature: "bg-gold text-navy",
};

const MENU_SECTION_FALLBACK: MenuSectionContent = { eyebrow: "The Goods", title: "Our", titleAccent: "Menu" };

export function Menu({ items: source = MENU, content = MENU_SECTION_FALLBACK }: { items?: MenuItem[]; content?: MenuSectionContent }) {
  const [filter, setFilter] = useState<string>("All");
  const FILTERS = ["All", ...Array.from(new Set(source.map((m) => m.category)))];
  const items = source.filter((m) => filter === "All" || m.category === filter);

  return (
    <section id="menu" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-display text-lg tracking-[0.4em] text-gold">
              {content.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
              {content.title} <span className="text-gold-grad">{content.titleAccent}</span>
            </h2>
          </div>
          {/* filter tabs */}
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor=""
                className={cn(
                  "rounded-full px-5 py-2 font-body text-sm font-semibold tracking-wide transition-colors",
                  filter === f
                    ? "bg-gold text-navy"
                    : "text-cream/70 hover:text-gold"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-gold/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                {item.badge && (
                  <span
                    className={cn(
                      "absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide",
                      badgeStyles[item.badge]
                    )}
                  >
                    {item.heat === 2 && <Flame className="h-3.5 w-3.5" />}
                    {item.badge}
                  </span>
                )}
                <span className="absolute right-4 top-4 rounded-full bg-navy/80 px-3 py-1 font-body text-lg font-semibold leading-none text-gold backdrop-blur">
                  {formatGBP(item.price)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <Link
                  href={`/food/${item.id}`}
                  className="font-body text-xl font-semibold tracking-tight text-cream transition-colors hover:text-gold"
                >
                  {item.name}
                </Link>
                <p className="mt-1 font-body text-sm font-medium text-gold/80">
                  {item.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  {item.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-2 pt-2">
                  <Link
                    href={`/food/${item.id}`}
                    data-cursor="CUSTOMIZE"
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 font-display text-base tracking-widest text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    Customize
                  </Link>
                  <AddToCartButton
                    item={item}
                    className="px-5 py-2"
                    label="Add"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
