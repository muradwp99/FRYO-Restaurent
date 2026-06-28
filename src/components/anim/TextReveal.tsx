"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** split granularity */
  by?: "chars" | "words" | "lines";
};

/** Scroll-triggered masked reveal for display text. */
export function TextReveal({ children, className, as = "h2", by = "chars" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type: by === "lines" ? "lines" : `lines,${by}`,
        linesClass: "split-line",
      });
      const targets =
        by === "chars" ? split.chars : by === "words" ? split.words : split.lines;
      gsap.from(targets, {
        yPercent: 120,
        autoAlpha: 0,
        rotateX: by === "chars" ? -40 : 0,
        stagger: by === "chars" ? 0.02 : 0.08,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [children, by]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={cn("[perspective:800px]", className)}>
      {children}
    </Tag>
  );
}
