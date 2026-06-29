import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAboutContent, getContactContent } from "@/server/content";
import { getSocials } from "@/server/appearance";
import { TextReveal } from "@/components/anim/TextReveal";
import { Reveal } from "@/components/anim/Reveal";
import { AboutValues } from "@/components/about/AboutValues";
import { Footer } from "@/components/sections/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "Big flavour, no compromise — the story behind FRYO.",
};

export default async function AboutPage() {
  const [about, socials, contact] = await Promise.all([getAboutContent(), getSocials(), getContactContent()]);

  return (
    <>
      <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-32 md:px-10">
        {/* Hero */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="font-display text-base tracking-[0.4em] text-gold">{about.eyebrow}</span>
            <TextReveal as="h1" by="words" className="mt-2 font-display text-6xl leading-[0.9] text-cream md:text-8xl">
              {`${about.headingTop} ${about.headingAccent}`}
            </TextReveal>
            <Reveal stagger className="mt-6 space-y-4">
              <p className="max-w-lg text-base leading-relaxed text-cream/70">{about.paragraph1}</p>
              <p className="max-w-lg text-base leading-relaxed text-cream/70">{about.paragraph2}</p>
            </Reveal>
          </div>

          <Reveal className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10">
            <Image src="/products/assembled.webp" alt="FRYO signature build" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-transparent to-gold/10" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/15 bg-ink/70 px-5 py-3 backdrop-blur">
              <p className="font-display text-2xl text-gold">{about.ribbonTitle}</p>
              <p className="text-xs tracking-widest text-cream/60">{about.ribbonSub}</p>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal stagger className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-display text-5xl text-gold-grad">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-cream/50">{s.label}</p>
            </div>
          ))}
        </Reveal>

        {/* Values */}
        <div className="mt-24 text-center">
          <span className="font-display text-base tracking-[0.4em] text-gold">What Sets Us Apart</span>
          <TextReveal as="h2" by="words" className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl">
            The FRYO Standard
          </TextReveal>
        </div>
        <div className="mt-12">
          <AboutValues />
        </div>

        {/* CTA */}
        <Reveal className="mt-20 overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-10 text-center md:p-16">
          <h2 className="font-display text-5xl leading-none text-cream md:text-7xl">
            Taste The <span className="text-gold-grad">Difference</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/60">Six signature builds, stacked to order. Your next obsession is one tap away.</p>
          <Link href="/#menu" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]">
            Explore The Menu <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
      <Footer socials={socials} contact={contact} />
    </>
  );
}
