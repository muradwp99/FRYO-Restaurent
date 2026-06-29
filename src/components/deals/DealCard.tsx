"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, Copy, Check, ArrowRight } from "lucide-react";
import type { Deal } from "@/lib/deals";
import { cn } from "@/lib/utils";

export function DealCard({ deal }: { deal: Deal }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(deal.code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="panel panel-hover group relative flex flex-col gap-3 overflow-hidden p-8">
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl",
          deal.tone === "gold" ? "bg-gold/20" : "bg-royal/40"
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl",
            deal.tone === "gold" ? "bg-gold/15 text-gold" : "bg-royal/40 text-cream"
          )}
        >
          <Tag className="h-5 w-5" />
        </span>
        <span className="font-display text-sm tracking-widest text-gold">{deal.badge}</span>
      </div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-cream">{deal.title}</h3>
      <p className="text-sm leading-relaxed text-cream/60">{deal.blurb}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <button
          onClick={copy}
          data-cursor=""
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/25 px-3 py-1.5 font-mono text-xs tracking-widest text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : deal.code}
        </button>
        <Link
          href={deal.href}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-5 py-2.5 font-display text-lg tracking-widest transition-all",
            deal.tone === "gold"
              ? "bg-gold text-navy hover:bg-gold-light"
              : "border border-gold/60 text-gold hover:bg-gold hover:text-navy"
          )}
        >
          {deal.cta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
