"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** stagger direct children instead of the wrapper itself */
  stagger?: boolean;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

export function Reveal({
  children,
  className,
  stagger = false,
  y = 40,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = stagger ? (gsap.utils.toArray(el.children) as HTMLElement[]) : [el];
      if (reduce) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.1 : 0,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
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
  }, [stagger, y, delay, duration, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
