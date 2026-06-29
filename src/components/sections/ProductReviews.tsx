import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";

export type ReviewItem = {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.round(value) ? "fill-gold text-gold" : "text-cream/20"}`} />
      ))}
    </span>
  );
}

export function ProductReviews({
  reviews,
  eyebrow = "Word On The Street",
  title = "Reviews",
}: {
  reviews: ReviewItem[];
  eyebrow?: string;
  title?: string;
}) {
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  return (
    <section className="relative border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-display text-base tracking-[0.4em] text-gold">{eyebrow}</span>
            <h2 className="mt-2 font-display text-4xl leading-none text-cream md:text-6xl">{title}</h2>
          </div>
          {count > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl text-gold">{avg.toFixed(1)}</span>
              <div>
                <Stars value={avg} />
                <p className="mt-1 text-xs tracking-widest text-cream/50">{count} review{count === 1 ? "" : "s"}</p>
              </div>
            </div>
          )}
        </div>

        {count === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <p className="text-cream/55">No reviews yet — be the first to try it.</p>
          </div>
        ) : (
          <Reveal stagger className="grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <figure key={r.id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="flex items-center justify-between">
                  <Quote className="h-7 w-7 text-gold/50" />
                  <Stars value={r.rating} />
                </div>
                <blockquote className="text-base leading-relaxed text-cream/85">“{r.comment}”</blockquote>
                <figcaption className="mt-auto flex items-center justify-between">
                  <span className="font-display text-xl tracking-wide text-cream">{r.customer}</span>
                  <span className="text-xs tracking-widest text-cream/40">{r.date}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
