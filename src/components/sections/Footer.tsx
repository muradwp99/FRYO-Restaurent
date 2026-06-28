"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Send, MapPin, Clock, Phone, Check } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { SocialLink } from "@/server/appearance";
import type { ContactContent } from "@/server/content";

const EXPLORE = [
  { label: "Menu", href: "/#menu" },
  { label: "Deals", href: "/deals" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Your Bag", href: "/cart" },
];

export function Footer({ socials = [], contact }: { socials?: SocialLink[]; contact?: ContactContent }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const address = contact ? `${contact.addressLine1}, ${contact.addressLine2}` : "42 Flame Street, Manchester M1 4FR";
  const phone = contact?.phone ?? "+44 161 555 0142";
  const hours = contact ? `${contact.hoursDays} · ${contact.hoursTime}` : "Daily · 11:00 – 23:00";

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pt-20">
      {/* glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-royal/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* CTA */}
        <Reveal className="flex flex-col items-start justify-between gap-6 pb-14 md:flex-row md:items-end">
          <h2 className="font-display text-6xl leading-[0.85] text-cream md:text-8xl">
            Still <span className="text-gold-grad">Hungry?</span>
          </h2>
          <Link
            href="/#menu"
            data-cursor="ORDER"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_40px_rgba(245,196,0,0.5)]"
          >
            Order Now
            <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>

        <div className="hairline" />

        {/* columns */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.3fr]">
          <div>
            <h3 className="font-display text-2xl tracking-widest text-gold">Explore</h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl tracking-widest text-gold">Visit</h3>
            <ul className="mt-5 space-y-3 text-sm text-cream/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" /> {phone}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-gold" /> {hours}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl tracking-widest text-gold">
              Get The Drop
            </h3>
            <p className="mt-5 text-sm text-cream/60">
              New builds, secret deals and free-food giveaways. No spam, just sauce.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
                setEmail("");
              }}
              className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-4"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                placeholder={subscribed ? "You're subscribed!" : "you@example.com"}
                className="min-w-0 flex-1 bg-transparent text-sm text-cream placeholder:text-cream/35 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                data-cursor=""
                aria-label="Subscribe"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-navy transition-colors hover:bg-gold-light"
              >
                {subscribed ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
            <SocialLinks socials={socials} className="mt-5" />
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs uppercase tracking-widest text-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} FRYO. All rights reserved.</p>
          <p>Fresh · Fried · Fearless</p>
        </div>
      </div>

      {/* immersive giant wordmark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="-mb-[2.5vw] text-center font-display text-[24vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(245,196,0,0.18)]">
          FRYO
        </div>
      </div>
    </footer>
  );
}
