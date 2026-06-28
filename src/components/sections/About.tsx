"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { AboutContent } from "@/server/content";

const FALLBACK: AboutContent = {
  eyebrow: "Who We Are",
  headingTop: "Big Flavour,",
  headingAccent: "No Compromise.",
  paragraph1:
    "FRYO is a fast-food joint obsessed with one thing: getting it right. Smash-style fillets seared to order, toasted buns and tortillas, and sauces we make in-house — from our smooth B&H mayo to that famous Algerian kick.",
  paragraph2:
    "Classic, Super Charger or BBQ — whichever you grab, it's built fresh, stacked loud and ready in minutes.",
  ribbonTitle: "Since Day One",
  ribbonSub: "FRIED TO PERFECTION",
  stats: [
    { value: "100%", label: "Fresh Fillets" },
    { value: "6", label: "Signature Builds" },
    { value: "£3.50", label: "Starting Price" },
    { value: "<10m", label: "To Your Hands" },
  ],
};

export function About({ content }: { content?: AboutContent }) {
  const c = content ?? FALLBACK;
  const STATS = c.stats;
  return (
    <section id="about" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        {/* image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10"
        >
          <Image
            src="/products/assembled.webp"
            alt="FRYO signature burger"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-transparent to-gold/10" />
          <div className="absolute bottom-6 left-6 rounded-2xl border border-white/15 bg-ink/70 px-5 py-3 backdrop-blur">
            <p className="font-display text-2xl text-gold">{c.ribbonTitle}</p>
            <p className="text-xs tracking-widest text-cream/60">
              {c.ribbonSub}
            </p>
          </div>
        </motion.div>

        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-display text-lg tracking-[0.4em] text-gold">
            {c.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-5xl leading-[0.9] text-cream md:text-7xl">
            {c.headingTop}
            <br />
            <span className="text-gold-grad">{c.headingAccent}</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/70">
            {c.paragraph1}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/70">
            {c.paragraph2}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-display text-4xl text-gold">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
