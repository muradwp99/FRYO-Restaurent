"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { ContactContent } from "@/server/content";
import { saveContactContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function ContactEditor({ initial }: { initial: ContactContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ContactContent>(initial);
  const set = <K extends keyof ContactContent>(k: K, v: ContactContent[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveContactContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Edits publish to the homepage “Get In Touch” section.</p>
        <Link href="/#contact" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input className={inputCls} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Accent</label>
              <input className={inputCls} value={form.titleAccent} onChange={(e) => set("titleAccent", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Address line 1</label>
            <input className={inputCls} value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Address line 2</label>
            <input className={inputCls} value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Opening days</label>
            <input className={inputCls} value={form.hoursDays} onChange={(e) => set("hoursDays", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Opening hours</label>
            <input className={inputCls} value={form.hoursTime} onChange={(e) => set("hoursTime", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved" : "Publish Changes"}
        </button>
      </div>
    </form>
  );
}
