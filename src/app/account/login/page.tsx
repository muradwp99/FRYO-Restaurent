import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccountSession } from "@/server/auth";
import { getSocials } from "@/server/appearance";
import { getContactContent } from "@/server/content";
import { AccountAuthForm } from "@/components/account/AccountAuthForm";
import { InteractiveGlow } from "@/components/anim/InteractiveGlow";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign In", description: "Access your FRYO account." };

export default async function AccountLoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const [session, { from }, socials, contact] = await Promise.all([
    getAccountSession(),
    searchParams,
    getSocials(),
    getContactContent(),
  ]);
  const dest = from && from.startsWith("/account") ? from : "/account";
  if (session) redirect(dest);

  return (
    <>
      <div className="relative overflow-hidden">
      <InteractiveGlow />
      <div className="relative mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 pb-20 pt-36 md:px-10">
        <span className="font-display text-base tracking-[0.4em] text-gold">Welcome Back</span>
        <h1 className="mt-2 font-display text-5xl leading-none text-cream md:text-6xl">
          Sign <span className="text-gold-grad">In</span>
        </h1>
        <p className="mt-3 text-cream/55">Track orders, save details and check out faster.</p>
        <AccountAuthForm mode="login" dest={dest} />
      </div>
      </div>
      <Footer socials={socials} contact={contact} />
    </>
  );
}
