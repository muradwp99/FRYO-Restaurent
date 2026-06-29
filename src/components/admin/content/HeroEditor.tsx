"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { HeroContent } from "@/server/content";
import { saveHeroContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function HeroEditor({ initial }: { initial: HeroContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<HeroContent>(initial);

  const setScene = (i: number, key: "heading" | "sub" | "body", v: string) =>
    setForm((f) => ({ ...f, scenes: f.scenes.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveHeroContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">The three scrolling hero scenes &amp; the stat counters. Use line breaks in the heading for stacked text.</p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {form.scenes.map((s, i) => (
          <div key={i} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Scene {i + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Heading (line breaks allowed)</label>
                <textarea rows={2} className={inputCls} value={s.heading} onChange={(e) => setScene(i, "heading", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Sub-heading</label>
                <input className={inputCls} value={s.sub} onChange={(e) => setScene(i, "sub", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Body</label>
                <textarea rows={2} className={inputCls} value={s.body} onChange={(e) => setScene(i, "body", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-200 tracking-wide">Stat counters</p>
          <p className="text-xs text-slate-400 mt-0.5 tracking-wide">The hero stat band is now managed on its own page.</p>
        </div>
        <Link href="/fryo-kanji/content/stats" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light border border-gold/30 hover:border-gold/50 rounded-lg px-3 py-2 transition-colors tracking-wide shrink-0">
          Edit Stats Counters <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
