"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Braces } from "lucide-react";
import type { SchemaSettings } from "@/server/schema";
import { saveSchemaSettingsAction } from "@/server/actions/schema";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function SchemaEditor({ initial, preview }: { initial: SchemaSettings; preview: Record<string, unknown> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<SchemaSettings>(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveSchemaSettingsAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="bg-ink-2 rounded-xl border border-gold/30 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0"><Braces className="w-4.5 h-4.5 text-gold" /></div>
        <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
          A schema.org <span className="text-white font-medium">Restaurant</span> block is auto-built from your Settings, Contact, SEO and Social links, then injected on the homepage for rich search results.
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
          <span className="text-sm text-slate-200 tracking-wide">Structured data {form.enabled ? "enabled" : "disabled"}</span>
        </label>
        <div>
          <label className={labelCls}>Price range</label>
          <input className={inputCls} value={form.priceRange} onChange={(e) => setForm((f) => ({ ...f, priceRange: e.target.value }))} placeholder="££" />
        </div>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
        <p className={labelCls}>Generated JSON-LD (preview)</p>
        <pre className="mt-1 text-xs text-slate-300 bg-royal/20 border border-white/8 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
          {JSON.stringify(preview, null, 2)}
        </pre>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
