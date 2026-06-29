"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Check, ChefHat, Bike, Home, PartyPopper, MapPin } from "lucide-react";
import { useOrder } from "@/store/order";
import { formatGBP } from "@/lib/utils";

const STEPS = [
  { icon: Check, label: "Confirmed" },
  { icon: ChefHat, label: "Preparing" },
  { icon: Bike, label: "On The Way" },
  { icon: Home, label: "Delivered" },
];
const ACTIVE = 1; // demo: currently "Preparing"

export default function OrderConfirmedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const last = useOrder((s) => s.last);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted || !barRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${(ACTIVE / (STEPS.length - 1)) * 100}%`,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.3,
        },
      );
      gsap.set(".oc-reveal", { autoAlpha: 0, y: 30 });
      gsap.to(".oc-reveal", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    });
    return () => {
      ctx.revert();
      if (typeof gsap.killTweensOf === "function") {
        gsap.killTweensOf(barRef.current);
      }
      ScrollTrigger.refresh();
    };
  }, [mounted]);

  if (!mounted) {
    return <div className="pt-36 text-center text-cream/50">Loading…</div>;
  }

  if (!last) {
    return (
      <div className="mx-auto max-w-[700px] px-5 pb-24 pt-36 text-center">
        <h1 className="font-display text-5xl text-cream">No recent orders</h1>
        <p className="mt-3 text-cream/55">
          Place an order and track it here in real time.
        </p>
        <Link
          href="/#menu"
          className="mt-8 inline-flex rounded-full bg-gold px-7 py-3 font-display text-xl tracking-widest text-navy hover:bg-gold-light"
        >
          Browse The Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] px-5 pb-24 pt-28 md:px-10">
      {/* success header */}
      <div className="oc-reveal flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gold/15 text-gold glow-gold">
          <PartyPopper className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-6xl leading-none text-cream md:text-7xl">
          Order <span className="text-gold-grad">Confirmed</span>
        </h1>
        <p className="mt-3 text-cream/60">
          Thanks {last.name.split(" ")[0]} — your order{" "}
          <span className="font-mono text-gold">{last.id}</span> is in the
          kitchen.
        </p>
      </div>

      {/* tracker */}
      <div className="oc-reveal mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-white/10" />
          <div
            ref={barRef}
            className="absolute left-0 top-6 h-0.5 bg-gold"
            style={{ width: 0 }}
          />
          <div className="relative grid grid-cols-4">
            {STEPS.map((s, i) => {
              const done = i <= ACTIVE;
              return (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full border-2 transition-colors ${
                      done
                        ? "border-gold bg-gold text-navy"
                        : "border-white/15 bg-ink text-cream/40"
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`text-center text-xs uppercase tracking-widest ${
                      done ? "text-gold" : "text-cream/40"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-7 text-center text-sm text-cream/55">
          Estimated {last.method === "delivery" ? "delivery" : "collection"} in{" "}
          <span className="text-gold">20–30 min</span>
        </p>
      </div>

      {/* details */}
      <div className="oc-reveal mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-7">
        <ul className="space-y-3">
          {last.lines.map((l) => (
            <li key={l.lineId} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={l.image}
                  alt={l.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl tracking-wide text-cream">
                  {l.name} <span className="text-cream/40">×{l.qty}</span>
                </p>
                {l.options && (
                  <p className="truncate text-xs text-cream/45">{l.options}</p>
                )}
              </div>
              <span className="font-display text-lg text-gold">
                {formatGBP(l.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="hairline my-4" />
        <div className="flex items-center justify-between font-display text-2xl tracking-wide">
          <span className="text-cream/80">Total</span>
          <span className="text-gold">{formatGBP(last.total)}</span>
        </div>
        <div className="mt-4 flex items-start gap-2 text-sm text-cream/55">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {last.address}
        </div>
      </div>

      <div className="oc-reveal mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#menu"
          className="flex flex-1 items-center justify-center rounded-full bg-gold py-3.5 font-display text-xl tracking-widest text-navy transition-colors hover:bg-gold-light"
        >
          Order Again
        </Link>
        <Link
          href="/"
          className="flex flex-1 items-center justify-center rounded-full border border-white/15 py-3.5 font-display text-xl tracking-widest text-cream/80 transition-colors hover:border-gold/60 hover:text-gold"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
