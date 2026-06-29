"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowUpRight, Flame } from "lucide-react";
import { MENU, type MenuItem } from "@/lib/menu";
import type { LineupContent } from "@/server/content";
import { formatGBP } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const LINEUP_FALLBACK: LineupContent = {
  eyebrow: "The Lineup",
  title: "Six Builds.",
  titleAccent: "One Obsession.",
  ctaLabel: "Customize",
};

export function Lineup({
  items = MENU,
  content = LINEUP_FALLBACK,
}: {
  items?: MenuItem[];
  content?: LineupContent;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Horizontal scroll via CSS `sticky` + a scrubbed transform — NOT ScrollTrigger
    // `pin`. Pinning wraps the section in a pin-spacer that GSAP reparents outside
    // React, which throws "removeChild … not a child" when navigating away. The
    // sticky approach keeps every node React-owned, so unmount is always safe.
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const distance = () =>
          Math.max(track.scrollWidth - window.innerWidth + 96, 0);
        // tall section gives the vertical scroll room the sticky inner needs
        const setHeight = () =>
          gsap.set(section, { height: window.innerHeight + distance() });
        setHeight();

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: setHeight,
          },
        });

        gsap.utils.toArray<HTMLElement>(".lineup-img").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.15 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => "+=" + distance(),
                scrub: true,
              },
            },
          );
        });

        return () => gsap.set(section, { clearProps: "height" });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-20 md:py-0">
      {/* sticky viewport — NOTE: no `overflow-hidden` on the section (an ancestor
          with overflow clip would break position: sticky). Clip on the inner. */}
      <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden">
        {/* heading */}
        <div className="mx-auto mb-10 max-w-[1400px] px-5 md:mb-8 md:px-10">
          <span className="font-display text-base tracking-[0.4em] text-gold">
            {content.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl">
            {content.title}{" "}
            <span className="text-gold-grad">{content.titleAccent}</span>
          </h2>
        </div>

        {/* horizontal track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto px-5 pb-4 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <article
              key={item.id}
              className="group relative flex h-[460px] w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] md:h-[64vh] md:w-[clamp(320px,32vw,440px)]"
            >
              <div className="relative h-1/2 overflow-hidden md:h-3/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="440px"
                  className="lineup-img object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink/70 font-display text-lg text-gold backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.heat === 2 && (
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-gold text-navy">
                    <Flame className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1 text-xs text-gold">
                  <Star className="h-3.5 w-3.5 fill-gold" /> {item.rating}
                  <span className="text-cream/40">· {item.calories} kcal</span>
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-cream">
                  {item.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-cream/55">
                  {item.tagline}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="font-display text-3xl text-gold">
                    {formatGBP(item.price)}
                  </span>
                  <Link
                    href={`/food/${item.id}`}
                    data-cursor="CUSTOMIZE"
                    className="inline-flex items-center gap-1 rounded-full border border-gold/60 px-4 py-2 font-display text-base tracking-widest text-gold transition-all hover:bg-gold hover:text-navy"
                  >
                    {content.ctaLabel} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* end card */}
          <Link
            href="/deals"
            className="group relative hidden h-[64vh] w-[320px] shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-gold/30 bg-gold/5 p-8 text-center transition-colors hover:bg-gold/10 md:flex"
          >
            <span className="font-display text-5xl leading-none text-gold-grad">
              Hungry
              <br />
              For More?
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-5 py-2.5 font-display text-lg tracking-widest text-navy">
              See The Deals <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
