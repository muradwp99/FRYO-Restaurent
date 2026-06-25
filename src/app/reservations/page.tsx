"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Cake,
  Heart,
  Briefcase,
  Sparkles,
  Utensils,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GUESTS = [1, 2, 3, 4, 5, 6, 8, 10, 12];
const OCCASIONS = [
  { id: "none", label: "No occasion", icon: Utensils },
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "anniversary", label: "Anniversary", icon: Heart },
  { id: "date", label: "Date Night", icon: Sparkles },
  { id: "business", label: "Business Meal", icon: Briefcase },
];

const INFO = [
  { icon: Clock, title: "Opening Hours", lines: ["Mon–Sun · 11:00 – 23:00"] },
  { icon: Users, title: "Group Size", lines: ["Tables for 1–12 guests"] },
  { icon: CalendarDays, title: "Booking Window", lines: ["Up to 60 days ahead"] },
  { icon: Sparkles, title: "Private Dining", lines: ["Events — call us directly"] },
];

export default function ReservationsPage() {
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState("none");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-28 md:px-10">
      <div className="mb-10">
        <span className="font-display text-base tracking-[0.4em] text-gold">
          Table Reservation
        </span>
        <h1 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
          Book Your <span className="text-gold-grad">Table</span>
        </h1>
      </div>

      {done ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-gold/30 bg-gold/[0.06] py-24 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-navy glow-gold">
            <Check className="h-9 w-9" />
          </span>
          <h2 className="font-display text-4xl tracking-wide text-cream">
            Reservation Requested
          </h2>
          <p className="max-w-md text-cream/60">
            Thanks! We&apos;ve got your request for a table of {guests}. We&apos;ll
            text you shortly to confirm.
          </p>
          <button
            onClick={() => setDone(false)}
            className="rounded-full border border-gold/60 px-6 py-2.5 font-display text-lg tracking-widest text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Make Another
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <section className="panel p-6 md:p-8">
              <h2 className="mb-5 flex items-center gap-2 font-display text-2xl tracking-wide text-cream">
                <CalendarDays className="h-5 w-5 text-gold" /> When are you coming?
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <input required type="date" className="input-base" />
                </Field>
                <Field label="Time">
                  <input required type="time" className="input-base" />
                </Field>
              </div>
              <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-cream/50">
                Number of guests
              </p>
              <div className="flex flex-wrap gap-2">
                {GUESTS.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGuests(g)}
                    data-cursor=""
                    className={cn(
                      "h-11 w-11 rounded-full border font-display text-lg transition-all",
                      guests === g
                        ? "border-gold bg-gold text-navy"
                        : "border-white/10 bg-white/[0.03] text-cream/70 hover:border-gold/40"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel p-6 md:p-8">
              <h2 className="mb-5 flex items-center gap-2 font-display text-2xl tracking-wide text-cream">
                <Users className="h-5 w-5 text-gold" /> Your details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input required placeholder="Jane Smith" className="input-base" />
                </Field>
                <Field label="Phone" icon={<Phone className="h-4 w-4" />}>
                  <input required type="tel" placeholder="07700 900123" className="input-base" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email">
                    <input type="email" placeholder="jane@example.com" className="input-base" />
                  </Field>
                </div>
              </div>
            </section>

            <section className="panel p-6 md:p-8">
              <h2 className="mb-5 flex items-center gap-2 font-display text-2xl tracking-wide text-cream">
                <Sparkles className="h-5 w-5 text-gold" /> Special occasion?
              </h2>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    type="button"
                    key={o.id}
                    onClick={() => setOccasion(o.id)}
                    data-cursor=""
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all",
                      occasion === o.id
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-white/10 bg-white/[0.03] text-cream/70 hover:border-gold/40"
                    )}
                  >
                    <o.icon className="h-4 w-4" />
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Field label="Special requests">
                  <textarea
                    rows={3}
                    placeholder="Allergies, seating preferences, high chairs…"
                    className="input-base resize-none"
                  />
                </Field>
              </div>
            </section>

            <button
              type="submit"
              data-cursor="BOOK"
              className="flex w-full items-center justify-center rounded-full bg-gold py-4 font-display text-2xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]"
            >
              Review Reservation
            </button>
          </form>

          {/* sidebar */}
          <aside className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {INFO.map((c) => (
                <div key={c.title} className="panel p-5">
                  <c.icon className="h-5 w-5 text-gold" />
                  <h3 className="mt-3 font-display text-lg tracking-wide text-cream">
                    {c.title}
                  </h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-0.5 text-xs text-cream/55">
                      {l}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-royal/30 to-ink p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-navy">
                <MapPin className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl tracking-wide text-cream">
                FRYO — Manchester
              </h3>
              <p className="mt-1 text-sm text-cream/60">42 Flame Street, M1 4FR</p>
            </div>

            <div className="panel p-6">
              <h3 className="flex items-center gap-2 font-display text-xl tracking-wide text-cream">
                <ShieldCheck className="h-5 w-5 text-gold" /> Booking Policy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/55">
                Reservations are held for <span className="text-gold">15 minutes</span>{" "}
                past the booking time. Groups of 8+ may require a deposit.
                Cancellations should be made at least{" "}
                <span className="text-gold">24 hours</span> in advance.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-widest text-cream/50">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
