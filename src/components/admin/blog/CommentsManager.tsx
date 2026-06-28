"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, Loader2, Clock, MessageSquare } from "lucide-react";
import type { BlogComment, CommentStatus } from "@/server/blog";
import { setCommentStatusAction, deleteCommentAction } from "@/server/actions/blog";

export function CommentsManager({ comments }: { comments: BlogComment[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<"All" | CommentStatus>("Pending");

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      setBusyId(null);
      router.refresh();
    });
  };

  const counts = {
    All: comments.length,
    Pending: comments.filter((c) => c.status === "Pending").length,
    Approved: comments.filter((c) => c.status === "Approved").length,
  };
  const shown = comments.filter((c) => tab === "All" || c.status === tab);

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex gap-1 bg-royal/20 p-1 rounded-lg border border-white/8 w-fit">
        {(["Pending", "Approved", "All"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all tracking-wide ${
              tab === t ? "bg-gold text-navy shadow-sm shadow-gold/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t} <span className={`ml-1 text-xs ${tab === t ? "text-navy/60" : "text-slate-600"}`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.length === 0 ? (
          <div className="bg-ink-2 rounded-xl border border-white/8 p-10 text-center text-slate-500 text-sm tracking-wide">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-600" /> No {tab.toLowerCase()} comments.
          </div>
        ) : (
          shown.map((c) => {
            const busy = pending && busyId === c.id;
            return (
              <div key={c.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold shrink-0">{c.author[0]}</div>
                    <div>
                      <p className="font-semibold text-slate-200 text-sm tracking-wide">{c.author}</p>
                      <p className="text-xs text-slate-500 tracking-wide mt-0.5">on “{c.postTitle}” · {c.date}</p>
                    </div>
                  </div>
                  {c.status === "Approved" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 bg-emerald-400/10 text-emerald-300 ring-emerald-400/20 tracking-wide"><Check className="w-3 h-3" /> Approved</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 bg-orange-400/10 text-orange-300 ring-orange-400/20 tracking-wide"><Clock className="w-3 h-3" /> Pending</span>
                  )}
                </div>

                <p className="text-sm text-slate-400 mt-3 leading-relaxed tracking-wide">{c.body}</p>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/8">
                  {c.status === "Pending" ? (
                    <button onClick={() => run(c.id, () => setCommentStatusAction(c.id, "Approved"))} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors tracking-wide disabled:opacity-50">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  ) : (
                    <button onClick={() => run(c.id, () => setCommentStatusAction(c.id, "Pending"))} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide disabled:opacity-50">
                      Unapprove
                    </button>
                  )}
                  <button onClick={() => { if (confirm("Delete this comment?")) run(c.id, () => deleteCommentAction(c.id)); }} disabled={busy} className="ml-auto flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
