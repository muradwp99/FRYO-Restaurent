"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Code } from "lucide-react";
import type { CustomCode } from "@/server/customcode";
import { saveCustomCodeAction } from "@/server/actions/customcode";

const taCls =
  "w-full px-3 py-2.5 text-xs bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 font-mono leading-relaxed";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function CustomCodeEditor({ initial }: { initial: CustomCode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<CustomCode>(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveCustomCodeAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="bg-ink-2 rounded-xl border border-gold/30 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0"><Code className="w-4.5 h-4.5 text-gold" /></div>
        <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
          Inject custom HTML/embeds site-wide. For analytics pixels use <span className="text-white font-medium">Tracking &amp; Pixels</span> — it loads scripts the right way.
        </p>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.enabled ? "bg-gold" : "bg-white/10"}`}
            aria-pressed={form.enabled}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.enabled ? "translate-x-5" : ""}`} />
          </button>
          <span className="text-sm text-slate-200 tracking-wide">Custom code {form.enabled ? "enabled" : "disabled"}</span>
        </label>

        <div className="pt-2 border-t border-white/8 space-y-4">
          <div>
            <label className={labelCls}>Header code</label>
            <textarea rows={5} className={taCls} value={form.headHtml} onChange={(e) => setForm((f) => ({ ...f, headHtml: e.target.value }))} placeholder="<style>…</style>  ·  embeds, verification widgets" />
          </div>
          <div>
            <label className={labelCls}>Footer code (before &lt;/body&gt;)</label>
            <textarea rows={5} className={taCls} value={form.bodyHtml} onChange={(e) => setForm((f) => ({ ...f, bodyHtml: e.target.value }))} placeholder="<!-- chat widget, embeds… -->" />
          </div>
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
