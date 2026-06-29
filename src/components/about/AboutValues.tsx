"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, ChefHat, Leaf, Bike, type LucideIcon } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Flame,
    title: "Seared To Order",
    body: "Every fillet hits the flat-top the moment you order — never pre-cooked, never sitting.",
  },
  {
    icon: ChefHat,
    title: "House-Made Sauces",
    body: "From smooth B&H mayo to the famous Algerian kick, our sauces are mixed in-house daily.",
  },
  {
    icon: Leaf,
    title: "100% Fresh",
    body: "Crisp lettuce, ripe tomato and toasted buns — quality you can taste in every bite.",
  },
  {
    icon: Bike,
    title: "Sub-10 Delivery",
    body: "A tight kitchen pipeline gets your build to the door before it ever cools down.",
  },
];

export function AboutValues() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".value-card");
      if (reduce) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(cards, {
        autoAlpha: 0,
        y: 50,
        scale: 0.94,
        duration: 0.6,
        ease: "back.out(1.5)",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      // gentle float on the icons
      gsap.utils.toArray<HTMLElement>(".value-icon").forEach((icon, i) => {
        gsap.to(icon, {
          y: -6,
          repeat: -1,
          yoyo: true,
          duration: 1.8 + i * 0.2,
          ease: "sine.inOut",
        });
      });
    }, el);
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el || trigger.vars?.trigger === el) {
          trigger.kill();
        }
      });
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {VALUES.map((v) => (
        <div
          key={v.title}
          className="value-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-gold/40"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="value-icon grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
            <v.icon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-2xl tracking-wide text-cream">
            {v.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/60">{v.body}</p>
        </div>
      ))}
    </div>
  );
}
