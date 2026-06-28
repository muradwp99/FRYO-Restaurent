"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { AboutContent } from "@/server/content";
import { saveAboutContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<AboutContent>(initial);
  const set = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setStat = (i: number, key: "value" | "label", v: string) =>
    setForm((f) => ({ ...f, stats: f.stats.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveAboutContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Edits publish to the homepage “About” section.</p>
        <Link href="/#about" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input className={inputCls} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Heading (line 1)</label>
            <input className={inputCls} value={form.headingTop} onChange={(e) => set("headingTop", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Heading accent (line 2)</label>
            <input className={inputCls} value={form.headingAccent} onChange={(e) => set("headingAccent", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Paragraph 1</label>
          <textarea rows={3} className={inputCls} value={form.paragraph1} onChange={(e) => set("paragraph1", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Paragraph 2</label>
          <textarea rows={2} className={inputCls} value={form.paragraph2} onChange={(e) => set("paragraph2", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ribbon title</label>
            <input className={inputCls} value={form.ribbonTitle} onChange={(e) => set("ribbonTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Ribbon subtitle</label>
            <input className={inputCls} value={form.ribbonSub} onChange={(e) => set("ribbonSub", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <label className={labelCls}>Stat tiles</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {form.stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputCls} w-24`} value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} placeholder="100%" />
              <input className={inputCls} value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="Fresh Fillets" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
