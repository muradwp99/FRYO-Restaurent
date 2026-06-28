"use client";

import { useState, useTransition } from "react";
import { Star, ThumbsUp, Check, EyeOff, Eye, Trash2, Loader2, Clock } from "lucide-react";
import type { AdminReview } from "@/server/reviews";
import { setReviewStatusAction, toggleReviewHomeAction, deleteReviewAction } from "@/server/actions/reviews";
import { useRouter } from "next/navigation";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${s} ${i <= rating ? "text-gold fill-gold" : "text-royal/60 fill-royal/60"}`} />
      ))}
    </div>
  );
}

export function ReviewsManager({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<"All" | "Pending" | "Approved">("All");

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      setBusyId(null);
      router.refresh();
    });
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const counts = {
    All: reviews.length,
    Pending: reviews.filter((r) => r.status === "Pending").length,
    Approved: reviews.filter((r) => r.status === "Approved").length,
  };
  const shown = reviews.filter((r) => tab === "All" || r.status === tab);
  const onHome = reviews.filter((r) => r.status === "Approved" && r.showOnHome).length;

  return (
    <div className="space-y-5 max-w-275">
      {/* Overview */}
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="text-center shrink-0">
            <p className="text-6xl font-black text-white tracking-tight">{avg.toFixed(1)}</p>
            <div className="mt-2"><Stars rating={Math.round(avg)} size="md" /></div>
            <p className="text-xs text-slate-500 mt-2.5 tracking-widest uppercase">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 w-full grid grid-cols-3 gap-3">
            {([
              { label: "Pending", value: counts.Pending },
              { label: "Approved", value: counts.Approved },
              { label: "On Homepage", value: onHome },
            ]).map((s) => (
              <div key={s.label} className="bg-royal/20 rounded-lg border border-white/8 p-4">
                <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-xs text-slate-500 tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-royal/20 p-1 rounded-lg border border-white/8 w-fit">
        {(["All", "Pending", "Approved"] as const).map((t) => (
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

      {/* List */}
      <div className="space-y-3">
        {shown.map((r) => {
          const busy = pending && busyId === r.id;
          return (
            <div key={r.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold shrink-0">
                    {r.customer[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm tracking-wide">{r.customer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars rating={r.rating} />
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-300 font-medium tracking-wide">{r.item}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "Approved" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 bg-emerald-400/10 text-emerald-300 ring-emerald-400/20 tracking-wide">
                      <Check className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 bg-orange-400/10 text-orange-300 ring-orange-400/20 tracking-wide">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-400 mt-3.5 leading-relaxed tracking-wide">{r.comment}</p>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/8">
                <span className="text-xs text-slate-600 flex items-center gap-1.5 tracking-wide mr-auto">
                  <ThumbsUp className="w-3.5 h-3.5" /> {r.helpful} · {r.date}
                </span>

                {r.status === "Pending" ? (
                  <button
                    onClick={() => run(r.id, () => setReviewStatusAction(r.id, "Approved"))}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors tracking-wide disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                ) : (
                  <button
                    onClick={() => run(r.id, () => setReviewStatusAction(r.id, "Pending"))}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide disabled:opacity-50"
                  >
                    Unapprove
                  </button>
                )}

                <button
                  onClick={() => run(r.id, () => toggleReviewHomeAction(r.id, !r.showOnHome))}
                  disabled={busy || r.status !== "Approved"}
                  title={r.status !== "Approved" ? "Approve first to feature on homepage" : ""}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors tracking-wide disabled:opacity-40 ${
                    r.showOnHome
                      ? "border-gold/40 bg-gold/10 text-gold"
                      : "border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white"
                  }`}
                >
                  {r.showOnHome ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {r.showOnHome ? "On homepage" : "Show on home"}
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this review?")) run(r.id, () => deleteReviewAction(r.id));
                  }}
                  disabled={busy}
                  className="flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
