"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Copy, Check, X } from "lucide-react";
import type { MediaItem } from "@/server/media";
import { addMediaAction, deleteMediaAction } from "@/server/actions/system";
import { ImageUpload } from "@/components/admin/ImageUpload";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

export function MediaManager({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", url: "" });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    startTransition(async () => {
      await addMediaAction({ name: form.name || form.url, url: form.url });
      setForm({ name: "", url: "" });
      setAdding(false);
      router.refresh();
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Remove “${name}” from the library?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteMediaAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{items.length} assets</p>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add by URL
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((m) => {
          const busy = pending && busyId === m.id;
          return (
            <div key={m.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden group">
              <div className="relative h-32 bg-linear-to-br from-navy to-royal">
                <Image src={m.url} alt={m.name} fill sizes="240px" className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-200 truncate tracking-wide">{m.name}</p>
                <p className="text-[10px] text-slate-600 truncate font-mono mt-0.5">{m.url}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => { navigator.clipboard?.writeText(m.url).catch(() => {}); setCopied(m.id); setTimeout(() => setCopied(null), 1200); }}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide"
                  >
                    {copied === m.id ? <Check className="w-3 h-3 text-gold" /> : <Copy className="w-3 h-3" />} URL
                  </button>
                  <button onClick={() => remove(m.id, m.name)} disabled={busy} className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {adding && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[16vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAdding(false)} />
          <form onSubmit={add} className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">Add Media</h3>
              <button type="button" onClick={() => setAdding(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="hero-shot.webp" />
              </div>
              <ImageUpload value={form.url} onChange={(url) => setForm((f) => ({ ...f, url, name: f.name || url.split("/").pop() || "image" }))} label="Image (drag & drop or browse)" />
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
              <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
                {pending && <Loader2 className="w-4 h-4 animate-spin" />} Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
