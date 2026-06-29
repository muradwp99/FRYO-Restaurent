import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";

export function CTABand({
  title = "Still",
  titleAccent = "Hungry?",
  subtitle = "Six signature builds, stacked to order. Your next obsession is one tap away.",
  ctaLabel = "Order Now",
  ctaHref = "/menu",
}: {
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-10 text-center md:p-16">
          <h2 className="font-display text-5xl leading-none text-cream md:text-7xl">
            {title} <span className="text-gold-grad">{titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/60">{subtitle}</p>
          <Link
            href={ctaHref}
            data-cursor="ORDER"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
          >
            {ctaLabel} <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
