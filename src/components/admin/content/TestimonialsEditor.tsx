"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink, Plus, Trash2, Star } from "lucide-react";
import type { TestimonialsContent, ManualTestimonial } from "@/server/content";
import { saveTestimonialsContentAction } from "@/server/actions/content";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function TestimonialsEditor({ initial }: { initial: TestimonialsContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<TestimonialsContent>(initial);

  const setManual = (i: number, key: keyof ManualTestimonial, v: string | number) =>
    setForm((f) => ({ ...f, manual: f.manual.map((m, idx) => (idx === i ? { ...m, [key]: v } : m)) }));
  const addManual = () =>
    setForm((f) => ({ ...f, manual: [...f.manual, { quote: "", author: "", rating: 5 }] }));
  const removeManual = (i: number) =>
    setForm((f) => ({ ...f, manual: f.manual.filter((_, idx) => idx !== i) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveTestimonialsContentAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The scrolling testimonials marquee on the homepage.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Eyebrow</label>
            <input className={inputCls} value={form.eyebrow} onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer rounded-lg bg-royal/20 border border-white/8 p-3.5">
          <input
            type="checkbox"
            checked={form.autoPull}
            onChange={(e) => setForm((f) => ({ ...f, autoPull: e.target.checked }))}
            className="mt-0.5 w-4 h-4 accent-gold"
          />
          <span>
            <span className="block text-sm font-medium text-slate-100 tracking-wide">Pull approved reviews automatically</span>
            <span className="block text-xs text-slate-400 mt-0.5 tracking-wide">
              When on, the marquee shows Approved reviews flagged &ldquo;Show on home&rdquo; (manage under People → Reviews).
              When off, it uses the manual list below.
            </span>
          </span>
        </label>
      </div>

      <div className={`bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 transition-opacity ${form.autoPull ? "opacity-50" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Manual testimonials</p>
          <button type="button" onClick={addManual} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {form.manual.map((m, i) => (
            <div key={i} className="rounded-lg bg-royal/20 border border-white/8 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 tracking-wide">#{i + 1}</span>
                <button type="button" onClick={() => removeManual(i)} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea rows={2} className={`${inputCls} mb-2`} placeholder="Quote" value={m.quote} onChange={(e) => setManual(i, "quote", e.target.value)} />
              <div className="flex gap-2">
                <input className={inputCls} placeholder="Author" value={m.author} onChange={(e) => setManual(i, "author", e.target.value)} />
                <div className="flex items-center gap-1.5 shrink-0 bg-royal/30 border border-white/10 rounded-lg px-3">
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  <input
                    type="number" min={1} max={5}
                    className="w-12 bg-transparent text-sm text-slate-100 outline-none"
                    value={m.rating}
                    onChange={(e) => setManual(i, "rating", Math.max(1, Math.min(5, Number(e.target.value))))}
                  />
                </div>
              </div>
            </div>
          ))}
          {form.manual.length === 0 && <p className="text-sm text-slate-500 py-2 tracking-wide">No manual testimonials. Add one or keep auto-pull on.</p>}
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
