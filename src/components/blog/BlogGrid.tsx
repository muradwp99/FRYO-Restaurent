"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ArrowUpRight, PenTool } from "lucide-react";
import type { BlogPost } from "@/server/blog";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* a warm gradient per category so cards feel distinct without photos */
const GRADIENTS = [
  "from-gold/30 via-royal/30 to-ink",
  "from-royal/40 via-gold/15 to-ink",
  "from-orange-500/25 via-royal/30 to-ink",
  "from-gold/25 via-orange-500/15 to-ink",
];
const EMOJI: Record<string, string> = {
  Recipes: "🥘",
  "Behind the Scenes": "👨‍🍳",
  News: "📣",
  Guides: "📖",
};

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".blog-card");
      if (reduce) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(el, { perspective: 1000 });
      gsap.from(cards, {
        autoAlpha: 0,
        y: 60,
        rotateX: -12,
        transformOrigin: "top center",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
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

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-5xl mb-4">📝</p>
        <p className="font-display text-3xl text-cream/70">
          No stories yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((p, i) => (
        <Link
          key={p.id}
          href={`/blog/${p.slug}`}
          data-cursor="READ"
          className="blog-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-colors hover:border-gold/40"
        >
          <div
            className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
          >
            <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
              {EMOJI[p.category] ?? "🍔"}
            </span>
            <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-gold backdrop-blur">
              {p.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h2 className="font-body text-xl font-semibold leading-snug tracking-tight text-cream transition-colors group-hover:text-gold">
              {p.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream/55">
              {p.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              <span className="flex items-center gap-1.5 text-xs text-cream/45">
                <PenTool className="h-3.5 w-3.5 text-gold/70" /> {p.author}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-cream/45">
                <Clock className="h-3.5 w-3.5" /> {p.readingTime} min
              </span>
            </div>
          </div>

          <span className="absolute right-5 top-[10.5rem] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-gold text-navy opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-60%]">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
