"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, ExternalLink } from "lucide-react";
import type { HeaderConfig } from "@/server/appearance";
import { saveHeaderAction } from "@/server/actions/appearance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer rounded-lg bg-royal/20 border border-white/8 p-3.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 w-4 h-4 accent-gold" />
      <span>
        <span className="block text-sm font-medium text-slate-100 tracking-wide">{label}</span>
        <span className="block text-xs text-slate-400 mt-0.5 tracking-wide">{desc}</span>
      </span>
    </label>
  );
}

export function HeaderEditor({ initial }: { initial: HeaderConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<HeaderConfig>(initial);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveHeaderAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">
          The sticky site header. Edit nav links under Navigation Menus.
        </p>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide shrink-0">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-4">
        <div>
          <label className={labelCls}>&ldquo;Featured&rdquo; button label</label>
          <input className={`${inputCls} max-w-xs`} value={form.featuredLabel} onChange={(e) => setForm((f) => ({ ...f, featuredLabel: e.target.value }))} />
        </div>
        <Toggle
          label="Show Featured button"
          desc="The button that opens the featured-items drawer."
          checked={form.showFeatured}
          onChange={(v) => setForm((f) => ({ ...f, showFeatured: v }))}
        />
        <Toggle
          label="Show Account button"
          desc="The account icon in the header."
          checked={form.showAccount}
          onChange={(v) => setForm((f) => ({ ...f, showAccount: v }))}
        />
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
