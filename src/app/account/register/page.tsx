import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccountSession } from "@/server/auth";
import { getSocials } from "@/server/appearance";
import { getContactContent } from "@/server/content";
import { AccountAuthForm } from "@/components/account/AccountAuthForm";
import { InteractiveGlow } from "@/components/anim/InteractiveGlow";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create Account", description: "Join FRYO for faster checkout and order tracking." };

export default async function AccountRegisterPage() {
  const [session, socials, contact] = await Promise.all([getAccountSession(), getSocials(), getContactContent()]);
  if (session) redirect("/account");

  return (
    <>
      <div className="relative overflow-hidden">
      <InteractiveGlow />
      <div className="relative mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 pb-20 pt-36 md:px-10">
        <span className="font-display text-base tracking-[0.4em] text-gold">Join The Club</span>
        <h1 className="mt-2 font-display text-5xl leading-none text-cream md:text-6xl">
          Create <span className="text-gold-grad">Account</span>
        </h1>
        <p className="mt-3 text-cream/55">Faster checkout, live order tracking and members-only drops.</p>
        <AccountAuthForm mode="register" dest="/account" />
      </div>
      </div>
      <Footer socials={socials} contact={contact} />
    </>
  );
}
