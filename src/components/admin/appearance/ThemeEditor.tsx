"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { ThemeConfig } from "@/server/appearance";
import { saveThemeAction } from "@/server/actions/appearance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function ThemeEditor({ initial }: { initial: ThemeConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ThemeConfig>(initial);
  const set = (k: keyof ThemeConfig, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveThemeAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Brand naming used across the footer.</p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Brand name</label>
            <input className={inputCls} value={form.brandName} onChange={(e) => set("brandName", e.target.value)} placeholder="FRYO" />
            <p className="text-xs text-slate-500 mt-1.5 tracking-wide">Used in the footer copyright line.</p>
          </div>
          <div>
            <label className={labelCls}>Footer wordmark</label>
            <input className={inputCls} value={form.footerWordmark} onChange={(e) => set("footerWordmark", e.target.value)} placeholder="FRYO" />
            <p className="text-xs text-slate-500 mt-1.5 tracking-wide">The giant outlined word at the bottom of the site.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 tracking-wide leading-relaxed">
          The gold &amp; navy palette is defined in the design system (Tailwind theme). Brand-colour theming from
          here is on the roadmap.
        </p>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
