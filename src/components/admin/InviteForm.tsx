"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { acceptInviteAction } from "@/server/actions/invites";

const field =
  "w-full px-3.5 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-xl outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

export function InviteForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    startTransition(async () => {
      const res = await acceptInviteAction(token, password);
      if (res.ok) {
        router.replace("/fryo-kanji");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">New password</label>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={field} required />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Confirm password</label>
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" className={field} required />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 tracking-wide">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-60 text-navy text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors tracking-wide"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {pending ? "Setting up…" : "Set password & sign in"}
      </button>
    </form>
  );
}
