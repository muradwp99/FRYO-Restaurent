"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Search } from "lucide-react";
import type { GlobalSeo } from "@/server/seo";
import { saveGlobalSeoAction } from "@/server/actions/seo";
import { ImageUpload } from "@/components/admin/ImageUpload";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

function Counter({ len, min, max }: { len: number; min: number; max: number }) {
  const ok = len >= min && len <= max;
  return <span className={`text-[11px] tracking-wide ${ok ? "text-emerald-400" : "text-slate-500"}`}>{len} chars · ideal {min}–{max}</span>;
}

export function GlobalSeoEditor({ initial }: { initial: GlobalSeo }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<GlobalSeo>(initial);
  const set = <K extends keyof GlobalSeo>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveGlobalSeoAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="bg-ink-2 rounded-xl border border-gold/30 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0"><Search className="w-4.5 h-4.5 text-gold" /></div>
        <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
          These power the site-wide <span className="text-white font-medium">&lt;title&gt;</span>, meta description and Open Graph image — applied across every public page via the root layout.
        </p>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <div>
          <label className={labelCls}>Site URL (for OG / canonical)</label>
          <input className={inputCls} value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://fryo.co.uk" />
          <p className="text-[11px] text-slate-600 mt-1 tracking-wide">Currently a placeholder — set your real domain to fix OG links.</p>
        </div>
        <div>
          <label className={labelCls}>Default title</label>
          <input className={inputCls} value={form.defaultTitle} onChange={(e) => set("defaultTitle", e.target.value)} />
          <div className="mt-1"><Counter len={form.defaultTitle.length} min={50} max={60} /></div>
        </div>
        <div>
          <label className={labelCls}>Title template</label>
          <input className={inputCls} value={form.titleTemplate} onChange={(e) => set("titleTemplate", e.target.value)} placeholder="%s — FRYO" />
          <p className="text-[11px] text-slate-600 mt-1 tracking-wide">{"%s"} is replaced by each page's title.</p>
        </div>
        <div>
          <label className={labelCls}>Default description</label>
          <textarea rows={3} className={inputCls} value={form.defaultDescription} onChange={(e) => set("defaultDescription", e.target.value)} />
          <div className="mt-1"><Counter len={form.defaultDescription.length} min={140} max={160} /></div>
        </div>
        <ImageUpload value={form.ogImage} onChange={(url) => set("ogImage", url)} label="Default OG image (1200×630)" />
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
