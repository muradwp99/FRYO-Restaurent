"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Clock } from "lucide-react";
import type { BlogPost, PostInput, PostStatus } from "@/server/blog";
import { deletePostAction, setPostStatusAction } from "@/server/actions/blog";
import { PostForm } from "./PostForm";

const statusStyle: Record<PostStatus, string> = {
  Published: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Draft: "bg-white/5 text-slate-400 ring-white/10",
};

export function PostsManager({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<(PostInput & { id: string }) | null>(null);

  const remove = (id: string, title: string) => {
    if (!confirm(`Delete “${title}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deletePostAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const toggleStatus = (p: BlogPost) => {
    setBusyId(p.id);
    startTransition(async () => {
      await setPostStatusAction(p.id, p.status === "Published" ? "Draft" : "Published");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{posts.length} posts</p>
        <Link
          href="/fryo-kanji/blog/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide"
        >
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Title", "Author", "Category", "Date", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((p) => {
                const busy = pending && busyId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-slate-100 font-medium tracking-wide">{p.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 tracking-wide flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {p.readingTime} min read
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 tracking-wide whitespace-nowrap">{p.author}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs tracking-wide">{p.category}</td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs tracking-wide whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleStatus(p)}
                        disabled={busy}
                        title="Toggle publish"
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[p.status]} disabled:opacity-50`}
                      >
                        {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : p.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditing({ id: p.id, title: p.title, excerpt: p.excerpt, body: p.body, author: p.author, category: p.category, tags: p.tags, status: p.status })}
                          className="text-slate-600 hover:text-gold transition-colors p-1"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(p.id, p.title)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[6vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl bg-ink-2 border border-white/10 rounded-2xl shadow-2xl max-h-[86vh] overflow-y-auto scroll-thin">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 sticky top-0 bg-ink-2 z-10">
              <h3 className="font-bold text-white tracking-wide">Edit Post</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <PostForm
                initial={editing}
                submitLabel="Save Changes"
                onDone={() => { setEditing(null); router.refresh(); }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
