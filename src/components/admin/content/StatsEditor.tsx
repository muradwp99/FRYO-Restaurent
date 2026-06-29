"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { HeroContent, HeroStat } from "@/server/content";
import { saveHeroContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

/** Edits the hero stat counters (single source of truth: the hero block). */
export function StatsEditor({ initial }: { initial: HeroContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState<HeroStat[]>(initial.stats);

  const set = (i: number, key: keyof HeroStat, v: string | number) =>
    setStats((s) => s.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  const add = () => setStats((s) => [...s, { target: 0, suffix: "", label: "" }]);
  const remove = (i: number) => setStats((s) => s.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveHeroContentAction({ ...initial, stats });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The animated stat counters in the hero band (e.g. &ldquo;25K+ Orders Served&rdquo;). Each counts up from
          zero to its target on load.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Counters</p>
          <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add counter
          </button>
        </div>
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="rounded-lg bg-royal/20 border border-white/8 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 tracking-wide">#{i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className={labelCls}>Target</label>
                  <input type="number" min={0} className={inputCls} value={s.target} onChange={(e) => set(i, "target", Number(e.target.value))} />
                </div>
                <div className="col-span-1">
                  <label className={labelCls}>Suffix</label>
                  <input className={inputCls} placeholder="K+" value={s.suffix} onChange={(e) => set(i, "suffix", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Label</label>
                  <input className={inputCls} placeholder="Orders Served" value={s.label} onChange={(e) => set(i, "label", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-slate-500 py-2 tracking-wide">No counters. Add one to show the stats band.</p>}
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
