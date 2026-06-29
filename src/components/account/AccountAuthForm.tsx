"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { loginAccountAction, registerAccountAction } from "@/server/actions/account";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-cream outline-none transition-all placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/10";
const label = "mb-1.5 block text-xs font-medium uppercase tracking-widest text-cream/50";

export function AccountAuthForm({ mode, dest }: { mode: "login" | "register"; dest: string }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = isRegister
        ? await registerAccountAction({ name, email, password })
        : await loginAccountAction({ email, password });
      if (res.ok) {
        router.replace(dest);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {isRegister && (
        <div>
          <label className={label}>Full name</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" autoComplete="name" required />
        </div>
      )}
      <div>
        <label className={label}>Email</label>
        <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
      </div>
      <div>
        <label className={label}>Password</label>
        <input
          type="password"
          className={field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isRegister ? "At least 6 characters" : "••••••••"}
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-display text-xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.4)] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {isRegister ? "Create Account" : "Sign In"}
        {!pending && <ArrowRight className="h-5 w-5" />}
      </button>

      <p className="pt-2 text-center text-sm text-cream/55">
        {isRegister ? (
          <>Already have an account?{" "}
            <Link href="/account/login" className="text-gold transition-colors hover:text-gold-light">Sign in</Link>
          </>
        ) : (
          <>New to FRYO?{" "}
            <Link href="/account/register" className="text-gold transition-colors hover:text-gold-light">Create an account</Link>
          </>
        )}
      </p>
    </form>
  );
}
