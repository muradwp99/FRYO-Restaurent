import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  const { from } = await searchParams;
  // Only honour internal admin destinations.
  const dest = from && from.startsWith("/fryo-kanji") ? from : "/fryo-kanji";
  if (session) redirect(dest);

  return (
    <div className="auth-page min-h-screen bg-ink flex items-center justify-center p-6 text-cream">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/25">
            <span className="text-navy font-black text-xl tracking-tight">F</span>
          </div>
          <span className="font-black text-white text-2xl tracking-widest leading-none">FRYO</span>
        </div>

        <div className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-7 sm:p-8">
          <h1 className="text-xl font-bold text-white tracking-tight text-center">Admin sign in</h1>
          <p className="text-sm text-slate-400 mt-1.5 text-center tracking-wide">
            Sign in to manage the FRYO storefront.
          </p>

          <LoginForm dest={dest} />
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 tracking-wide leading-relaxed">
          Demo: <span className="text-slate-300 font-mono">orlando@fryo.co.uk</span> ·{" "}
          <span className="text-slate-300 font-mono">fryo-owner</span>
        </p>
      </div>
    </div>
  );
}
