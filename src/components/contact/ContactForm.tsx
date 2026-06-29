"use client";

import { useState, useTransition } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { submitContactAction } from "@/server/actions/messages";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-cream outline-none transition-all placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/10";
const label = "mb-1.5 block text-xs font-medium uppercase tracking-widest text-cream/50";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitContactAction(form);
      if (res.ok) {
        setDone(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-[820px] px-5 md:px-10">
        <Reveal className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <div className="mb-8 text-center">
            <span className="font-display text-base tracking-[0.4em] text-gold">Drop A Line</span>
            <h2 className="mt-2 font-display text-4xl leading-none text-cream md:text-5xl">Send Us A Message</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-cream/55">
              Questions, feedback or catering enquiries — we usually reply within a few hours.
            </p>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-gold" />
              <p className="font-display text-3xl text-cream">Message Sent!</p>
              <p className="max-w-sm text-sm text-cream/55">Thanks for reaching out — we&rsquo;ll get back to you at the email you provided.</p>
              <button
                onClick={() => setDone(false)}
                className="mt-2 text-sm tracking-wide text-gold transition-colors hover:text-gold-light"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Name</label>
                  <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoComplete="name" required />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" required />
                </div>
              </div>
              <div>
                <label className={label}>Subject</label>
                <input className={field} value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="What's it about?" />
              </div>
              <div>
                <label className={label}>Message</label>
                <textarea rows={5} className={field} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us more…" required />
              </div>

              {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-display text-xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.4)] disabled:opacity-60"
              >
                {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {pending ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
