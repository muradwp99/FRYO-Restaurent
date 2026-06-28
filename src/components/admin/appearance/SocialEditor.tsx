"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, Plus, Trash2, ExternalLink } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/server/appearance";
import { saveSocialsAction } from "@/server/actions/appearance";

const PLATFORMS: SocialPlatform[] = ["Instagram", "Facebook", "Twitter", "YouTube", "TikTok", "Website"];

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

export function SocialEditor({ initial }: { initial: SocialLink[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [rows, setRows] = useState<SocialLink[]>(initial.length ? initial : [{ platform: "Instagram", url: "" }]);

  const setRow = (i: number, patch: Partial<SocialLink>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { platform: "Website", url: "" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveSocialsAction(rows.filter((r) => r.url.trim()));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Links shown in the homepage footer &amp; contact section.</p>
        <Link href="/#contact" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors tracking-wide">
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={row.platform}
              onChange={(e) => setRow(i, { platform: e.target.value as SocialPlatform })}
              className={`${inputCls} w-36 shrink-0`}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p} className="bg-navy">{p}</option>
              ))}
            </select>
            <input
              className={inputCls}
              value={row.url}
              onChange={(e) => setRow(i, { url: e.target.value })}
              placeholder="https://instagram.com/fryo"
            />
            <button type="button" onClick={() => remove(i)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors shrink-0">
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
