"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight, GPU-friendly section background:
 *  - two slowly drifting gold/navy gradient blobs (pure CSS keyframes)
 *  - a soft spotlight that follows the pointer (CSS variables updated via a
 *    single rAF-throttled listener — no React re-renders, no canvas)
 * Honors prefers-reduced-motion (spotlight stays centred, blobs don't drift).
 * pointer-events: none so it never interferes with the UI. Drop inside a
 * `relative` parent; sits behind content.
 */
export function InteractiveGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 50, ty = 50;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${tx}%`);
        el.style.setProperty("--my", `${ty}%`);
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="glow-blob glow-blob-a" />
      <div className="glow-blob glow-blob-b" />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,30%), rgba(245,196,0,0.10), transparent 60%)" }}
      />
    </div>
  );
}
