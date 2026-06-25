"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="FRYO home"
      className={cn(
        "group inline-flex items-center gap-2 select-none",
        className
      )}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-md bg-gold text-navy shadow-[0_0_24px_rgba(245,196,0,0.45)] transition-transform duration-300 group-hover:rotate-6">
        <span className="font-display text-2xl leading-none">F</span>
        <span className="absolute -right-1 -top-1 text-xs">🔥</span>
      </span>
      <span className="font-display text-3xl leading-none tracking-wide text-cream">
        FR<span className="text-gold">YO</span>
      </span>
    </Link>
  );
}
