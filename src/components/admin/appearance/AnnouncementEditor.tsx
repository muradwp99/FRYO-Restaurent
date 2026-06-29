"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { AnnouncementConfig } from "@/server/appearance";
import { saveAnnouncementAction } from "@/server/actions/appearance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function AnnouncementEditor({ initial }: { initial: AnnouncementConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<AnnouncementConfig>(initial);
  const set = <K extends keyof AnnouncementConfig>(k: K, v: AnnouncementConfig[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveAnnouncementAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">A dismissible promo bar pinned above the site header.</p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Live preview */}
      <div>
        <p className={labelCls}>Preview</p>
        {form.enabled && form.message.trim() ? (
          <div className="flex h-9 items-center justify-center gap-2 rounded-lg bg-gold text-navy text-sm font-semibold tracking-wide px-4">
            <span className="truncate">{form.message}</span>
            {form.linkLabel.trim() && <span className="underline underline-offset-2">{form.linkLabel} →</span>}
          </div>
        ) : (
          <div className="flex h-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-xs text-slate-500 tracking-wide">
            Bar hidden
          </div>
        )}
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer rounded-lg bg-royal/20 border border-white/8 p-3.5">
          <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} className="mt-0.5 w-4 h-4 accent-gold" />
          <span>
            <span className="block text-sm font-medium text-slate-100 tracking-wide">Show the announcement bar</span>
            <span className="block text-xs text-slate-400 mt-0.5 tracking-wide">When off, the bar is removed from the site.</span>
          </span>
        </label>
        <div>
          <label className={labelCls}>Message</label>
          <input className={inputCls} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Free delivery on orders over £20 🔥" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Link label (optional)</label>
            <input className={inputCls} value={form.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} placeholder="Order now" />
          </div>
          <div>
            <label className={labelCls}>Link URL</label>
            <input className={inputCls} value={form.linkHref} onChange={(e) => set("linkHref", e.target.value)} placeholder="/#menu" />
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
