"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { FooterConfig } from "@/server/appearance";
import { saveFooterConfigAction } from "@/server/actions/appearance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function FooterEditor({ initial }: { initial: FooterConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FooterConfig>(initial);
  const set = (k: keyof FooterConfig, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveFooterConfigAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The site footer. The links column uses your Navigation Menus; socials live under Social Icons; the
          newsletter copy under Content → Newsletter Block.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Links column heading</label>
            <input className={inputCls} value={form.exploreHeading} onChange={(e) => set("exploreHeading", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Visit column heading</label>
            <input className={inputCls} value={form.visitHeading} onChange={(e) => set("visitHeading", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Bottom tagline</label>
          <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Fresh · Fried · Fearless" />
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
