"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { StepsContent } from "@/server/content";
import { saveStepsContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function StepsEditor({ initial }: { initial: StepsContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<StepsContent>(initial);

  const setStep = (i: number, key: "title" | "body", v: string) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveStepsContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">The homepage “How It Works” section. Icons are fixed per step.</p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input className={inputCls} value={form.eyebrow} onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-4">
        {form.steps.map((s, i) => (
          <div key={i} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Step {i + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr] gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={s.title} onChange={(e) => setStep(i, "title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Body</label>
                <input className={inputCls} value={s.body} onChange={(e) => setStep(i, "body", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
