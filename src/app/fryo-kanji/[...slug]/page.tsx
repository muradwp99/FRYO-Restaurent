"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import { findNavByHref } from "@/components/admin/navConfig";

export default function ComingSoonPage() {
  const pathname = usePathname() ?? "";
  const entry = findNavByHref(pathname);

  const title = entry?.label ?? "Section";
  const group = entry?.group ?? "Admin";

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-8 sm:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gold/12 flex items-center justify-center mx-auto mb-5">
          <Hammer className="w-7 h-7 text-gold" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{group}</p>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed tracking-wide">
          This screen is scaffolded in the navigation and ready to be built out. The shell, routing, and
          design system are in place — the page content is part of a later phase of the CMS spec.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500 bg-white/5 border border-white/8 rounded-lg px-3 py-2 font-mono tracking-wide">
          {pathname}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            href="/fryo-kanji"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
