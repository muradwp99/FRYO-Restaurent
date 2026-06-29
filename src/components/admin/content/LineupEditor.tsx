"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { LineupContent } from "@/server/content";
import { saveLineupContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function LineupEditor({ initial }: { initial: LineupContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<LineupContent>(initial);
  const set = (k: keyof LineupContent, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveLineupContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The horizontal &ldquo;Lineup&rdquo; showcase on the homepage. The cards themselves come from your
          featured menu items — edit those under Menu Items.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input className={inputCls} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Title accent (gold)</label>
            <input className={inputCls} value={form.titleAccent} onChange={(e) => set("titleAccent", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Per-card button label</label>
          <input className={`${inputCls} max-w-xs`} value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
