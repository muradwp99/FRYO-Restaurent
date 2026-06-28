"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { PageSeo } from "@/server/seo";
import { savePageSeoAction } from "@/server/actions/seo";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function PageSeoEditor({ initial }: { initial: PageSeo[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [pages, setPages] = useState<PageSeo[]>(initial);

  const setPage = (i: number, key: "title" | "description", v: string) =>
    setPages((p) => p.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await savePageSeoAction(pages);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <p className="text-sm text-slate-400 tracking-wide">Per-page title &amp; meta description overrides. These win over the global defaults.</p>

      <div className="space-y-4">
        {pages.map((p, i) => (
          <div key={p.path} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm tracking-wide">{p.label}</h3>
              <span className="font-mono text-xs text-slate-500 tracking-wide">{p.path}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={p.title} onChange={(e) => setPage(i, "title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Meta description</label>
                <textarea rows={2} className={inputCls} value={p.description} onChange={(e) => setPage(i, "description", e.target.value)} />
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
