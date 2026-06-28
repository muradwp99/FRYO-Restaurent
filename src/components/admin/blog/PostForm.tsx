"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { PostInput, PostStatus } from "@/server/blog";
import { savePostAction } from "@/server/actions/blog";

export const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
export const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export const emptyPost: PostInput = {
  title: "",
  excerpt: "",
  body: "",
  author: "",
  category: "Behind the Scenes",
  tags: [],
  status: "Draft",
};

export function PostForm({
  initial,
  submitLabel,
  onDone,
  onCancel,
}: {
  initial: PostInput;
  submitLabel: string;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<PostInput>(initial);
  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    startTransition(async () => {
      await savePostAction(form);
      onDone();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelCls}>Title</label>
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="The Secret Behind Our Smash Patty" required />
      </div>
      <div>
        <label className={labelCls}>Excerpt</label>
        <textarea rows={2} className={inputCls} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Body</label>
        <textarea rows={8} className={inputCls} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Write the post…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Author</label>
          <input className={inputCls} value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Chef Marco" />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Behind the Scenes" />
        </div>
        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input
            className={inputCls}
            value={form.tags.join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            placeholder="beef, technique"
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as PostStatus)}>
            <option className="bg-navy" value="Draft">Draft</option>
            <option className="bg-navy" value="Published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
        )}
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
