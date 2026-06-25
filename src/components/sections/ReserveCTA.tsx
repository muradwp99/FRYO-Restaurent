"use client";

import Link from "next/link";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";

export function ReserveCTA() {
  return (
    <section id="reservation" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-royal/30 via-ink-2 to-ink p-10 md:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-royal/40 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="font-display text-base tracking-[0.4em] text-gold">
                Dine In
              </span>
              <h2 className="mt-2 font-display text-5xl leading-[0.9] text-cream md:text-7xl">
                Pull Up A <span className="text-gold-grad">Seat.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cream/70">
                Rolling deep or flying solo? Lock in your table in seconds — pick
                a time, tell us the occasion, and we&apos;ll have it ready.
              </p>
            </div>

            <Link
              href="/reservations"
              data-cursor="BOOK"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_40px_rgba(245,196,0,0.5)]"
            >
              <CalendarDays className="h-6 w-6" />
              Book A Table
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
