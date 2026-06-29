"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/server/actions/auth";

export function LoginForm({ dest }: { dest: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (res.ok) {
        router.replace(dest);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  const field =
    "w-full px-3.5 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-xl outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
          Email
        </label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@fryo.co.uk"
          className={field}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={field}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 tracking-wide">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-60 text-navy text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors tracking-wide"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
