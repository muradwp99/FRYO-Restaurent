"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Creative cursor:
 *  - a precise gold dot at the pointer
 *  - a larger ring that trails with a spring lag
 *  - ring expands + shows a label on elements marked [data-cursor] / links / buttons
 *  Add data-cursor="ADD" (etc.) to any element to set the hover label.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  // detect a fine pointer once on mount, then render the cursor
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  // set up GSAP + listeners only after the cursor elements exist
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const interactiveSel = 'a, button, [role="button"], input, textarea, [data-cursor]';

    const onOver = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest(interactiveSel) as
        | HTMLElement
        | null;
      if (!target) return;
      const text = target.getAttribute("data-cursor") || "";
      gsap.to(ring, {
        scale: text ? 2.6 : 1.9,
        backgroundColor: "rgba(245,196,0,0.12)",
        borderColor: "rgba(245,196,0,0.9)",
        duration: 0.3,
        ease: "power3",
      });
      gsap.to(dot, { scale: 0.4, duration: 0.3 });
      if (text) {
        label.textContent = text;
        gsap.to(label, { autoAlpha: 1, duration: 0.2 });
      }
    };

    const onOut = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest(interactiveSel) as
        | HTMLElement
        | null;
      if (!target) return;
      gsap.to(ring, {
        scale: 1,
        backgroundColor: "rgba(245,196,0,0)",
        borderColor: "rgba(255,253,240,0.6)",
        duration: 0.3,
        ease: "power3",
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(label, { autoAlpha: 0, duration: 0.15 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 });
    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-cream/60 opacity-0 mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <span
          ref={labelRef}
          className="font-display text-[10px] tracking-widest text-gold opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gold opacity-0"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
