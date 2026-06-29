"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";
import { TextReveal } from "@/components/anim/TextReveal";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Review = { name: string; text: string; stars: number };
type Header = { eyebrow: string; title: string };
const HEADER_FALLBACK: Header = { eyebrow: "Word On The Street", title: "Loved By The Hungry" };

const FALLBACK_REVIEWS: Review[] = [
  { name: "Maya R.", text: "The Super Charger is dangerously good. That Algerian sauce should be illegal.", stars: 5 },
  { name: "Tariq B.", text: "Customised my BBQ burger exactly how I like it. Showed up hot and perfect.", stars: 5 },
  { name: "Jess W.", text: "Fastest delivery in the city and the wraps actually hold together. Obsessed.", stars: 5 },
  { name: "Leon K.", text: "Been three times this week. The brioche bun is unreal. Send help.", stars: 5 },
  { name: "Priya S.", text: "Minimalist app, maximalist flavour. The build-your-own flow is so smooth.", stars: 4 },
  { name: "Danny O.", text: "Classic burger for £3.99 that tastes like a tenner. Mad value.", stars: 5 },
];

export function Testimonials({ reviews, header = HEADER_FALLBACK }: { reviews?: Review[]; header?: Header }) {
  const REVIEWS = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let io: IntersectionObserver | null = null;
    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: -half,
        duration: 28,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => `${(parseFloat(x) % half)}px` },
      });
      const enter = () => gsap.to(tween, { timeScale: 0, duration: 0.6 });
      const leave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      track.addEventListener("pointerenter", enter);
      track.addEventListener("pointerleave", leave);

      // Pause the marquee while it's off-screen so it never burns frame budget
      // during hero/other-section scrolling (a key source of homepage jank).
      io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()),
        { rootMargin: "200px" },
      );
      io.observe(track);

      return () => {
        track.removeEventListener("pointerenter", enter);
        track.removeEventListener("pointerleave", leave);
      };
    }, track);

    return () => {
      io?.disconnect();
      ctx.revert();
      if (typeof gsap.killTweensOf === "function") {
        gsap.killTweensOf(track);
      }
      ScrollTrigger.refresh();
    };
  }, []);

  const cards = [...REVIEWS, ...REVIEWS];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-14 max-w-[1400px] px-5 text-center md:px-10">
        <span className="font-display text-base tracking-[0.4em] text-gold">
          {header.eyebrow}
        </span>
        <TextReveal
          as="h2"
          by="words"
          className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl"
        >
          {header.title}
        </TextReveal>
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <div ref={trackRef} className="flex w-max gap-5 px-5">
        {cards.map((r, i) => (
          <figure
            key={i}
            className="panel flex w-[340px] shrink-0 flex-col gap-4 p-7"
          >
            <Quote className="h-8 w-8 text-gold/50" />
            <blockquote className="text-base leading-relaxed text-cream/85">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-auto flex items-center justify-between">
              <span className="font-display text-xl tracking-wide text-cream">
                {r.name}
              </span>
              <span className="flex gap-0.5">
                {Array.from({ length: r.stars }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
