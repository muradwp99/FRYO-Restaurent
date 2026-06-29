import { Flame, Truck, SlidersHorizontal, Leaf } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { InteractiveGlow } from "@/components/anim/InteractiveGlow";

type Perk = { icon: React.ReactNode; title: string; body: string };

const DEFAULT_PERKS: Perk[] = [
  { icon: <Flame className="h-6 w-6" />, title: "Fried To Order", body: "Smash-style fillets seared the second you tap — never sitting under a lamp." },
  { icon: <SlidersHorizontal className="h-6 w-6" />, title: "Built Your Way", body: "Swap the bun, dial the spice, drop or pile on extras. Your build, your rules." },
  { icon: <Truck className="h-6 w-6" />, title: "Fast To Your Door", body: "Live order tracking from our kitchen to your hands in minutes, not hours." },
  { icon: <Leaf className="h-6 w-6" />, title: "Fresh, Always", body: "House-made sauces and produce prepped daily. No shortcuts, no compromise." },
];

export function Perks({
  eyebrow = "Why FRYO",
  title = "Flavour, Done Right",
  perks = DEFAULT_PERKS,
}: {
  eyebrow?: string;
  title?: string;
  perks?: Perk[];
}) {
  return (
    <section className="relative py-20 md:py-28">
      <InteractiveGlow />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="font-display text-base tracking-[0.4em] text-gold">{eyebrow}</span>
          <h2 className="mt-2 font-display text-4xl leading-none text-cream md:text-6xl">{title}</h2>
        </div>
        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-gold/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                {p.icon}
              </div>
              <h3 className="mt-5 font-display text-2xl tracking-wide text-cream">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/55">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
