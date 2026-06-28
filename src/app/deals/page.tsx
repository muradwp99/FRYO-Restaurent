import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { getPublicDeals } from "@/server/deals";
import { getPageMetadata } from "@/server/seo";
import { Reveal } from "@/components/anim/Reveal";
import { DealCard } from "@/components/deals/DealCard";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata("/deals");
}

export default async function DealsPage() {
  const deals = await getPublicDeals();

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-28 md:px-10">
      <div className="mb-12">
        <span className="font-display text-base tracking-[0.4em] text-gold">
          Save More, Eat More
        </span>
        <h1 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
          The <span className="text-gold-grad">Deals</span>
        </h1>
        <p className="mt-4 max-w-md text-cream/60">
          Stack the savings. Codes apply at checkout — tap to copy.
        </p>
      </div>

      <Reveal stagger className="grid gap-5 md:grid-cols-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </Reveal>

      {/* banner */}
      <Reveal className="mt-6 overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-10 text-center md:p-16">
        <Truck className="mx-auto h-10 w-10 text-gold" />
        <h2 className="mt-4 font-display text-5xl leading-none text-cream md:text-7xl">
          Free Delivery <span className="text-gold-grad">Over £20</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/60">
          No code needed. Just build your order over £20 and the delivery fee
          disappears automatically at checkout.
        </p>
        <Link
          href="/#menu"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
        >
          Order Now <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </div>
  );
}
