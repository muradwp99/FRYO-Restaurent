"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { ItemSeo } from "@/server/seo";
import { saveFoodSeoAction, saveBlogSeoAction } from "@/server/actions/seo";

export type SeoTarget = {
  key: string;
  label: string;
  subtitle?: string;
  fallbackTitle: string;
  fallbackDescription: string;
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function ItemSeoEditor({
  kind,
  items,
  initial,
}: {
  kind: "food" | "blog";
  items: SeoTarget[];
  initial: ItemSeo[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  // key → { title, description } working state, seeded from existing overrides.
  const seed: Record<string, { title: string; description: string }> = {};
  for (const it of items) {
    const o = initial.find((x) => x.key === it.key);
    seed[it.key] = { title: o?.title ?? "", description: o?.description ?? "" };
  }
  const [values, setValues] = useState(seed);

  const set = (key: string, field: "title" | "description", v: string) =>
    setValues((s) => ({ ...s, [key]: { ...s[key], [field]: v } }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const rows: ItemSeo[] = Object.entries(values)
      .filter(([, v]) => v.title.trim() || v.description.trim())
      .map(([key, v]) => ({ key, title: v.title.trim(), description: v.description.trim() }));
    startTransition(async () => {
      if (kind === "food") await saveFoodSeoAction(rows);
      else await saveBlogSeoAction(rows);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <p className="text-sm text-slate-400 tracking-wide">
        Per-{kind === "food" ? "dish" : "post"} search & social overrides. Leave a field blank to use the
        automatic default shown as the placeholder.
      </p>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.key} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <p className="text-sm font-semibold text-white tracking-wide">{it.label}</p>
              {it.subtitle && <span className="text-xs text-slate-500 tracking-wide shrink-0">{it.subtitle}</span>}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelCls}>Meta title</label>
                <input
                  className={inputCls}
                  value={values[it.key]?.title ?? ""}
                  onChange={(e) => set(it.key, "title", e.target.value)}
                  placeholder={it.fallbackTitle}
                />
              </div>
              <div>
                <label className={labelCls}>Meta description</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={values[it.key]?.description ?? ""}
                  onChange={(e) => set(it.key, "description", e.target.value)}
                  placeholder={it.fallbackDescription}
                />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500 py-4 tracking-wide">Nothing to optimise yet.</p>}
      </div>

      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-ink/80 backdrop-blur border-t border-white/8">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved" : "Publish Changes"}
        </button>
      </div>
    </form>
  );
}
