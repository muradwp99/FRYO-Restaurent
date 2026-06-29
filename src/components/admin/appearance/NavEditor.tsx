"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import type { NavConfig, NavLinkItem, NavLinkType } from "@/server/appearance";
import { saveNavAction } from "@/server/actions/appearance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

export function NavEditor({ initial }: { initial: NavConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [rows, setRows] = useState<NavLinkItem[]>(initial.links);

  const setRow = (i: number, patch: Partial<NavLinkItem>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { label: "", href: "/", type: "route" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setRows((r) => {
      const j = i + dir;
      if (j < 0 || j >= r.length) return r;
      const next = [...r];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveNavAction({ links: rows.filter((r) => r.label.trim() && r.href.trim()) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The primary navigation — used in the site header and footer. &ldquo;Scroll&rdquo; links jump to a
          homepage section (e.g. <span className="font-mono">#menu</span>); &ldquo;Route&rdquo; links go to a page.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-600 hover:text-slate-300 disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="text-slate-600 hover:text-slate-300 disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <input className={`${inputCls} w-32 shrink-0`} value={row.label} onChange={(e) => setRow(i, { label: e.target.value })} placeholder="Label" />
            <input className={inputCls} value={row.href} onChange={(e) => setRow(i, { href: e.target.value })} placeholder="/deals or #menu" />
            <select value={row.type} onChange={(e) => setRow(i, { type: e.target.value as NavLinkType })} className={`${inputCls} w-28 shrink-0`}>
              <option value="route" className="bg-navy">Route</option>
              <option value="scroll" className="bg-navy">Scroll</option>
            </select>
            <button type="button" onClick={() => remove(i)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors shrink-0" aria-label="Remove">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs text-gold hover:text-gold-light font-medium tracking-wide inline-flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add link
        </button>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
