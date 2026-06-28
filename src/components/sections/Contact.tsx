"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { ContactContent } from "@/server/content";
import type { SocialLink } from "@/server/appearance";
import { SocialLinks } from "@/components/ui/SocialLinks";

const FALLBACK: ContactContent = {
  eyebrow: "Say Hello",
  title: "Get In",
  titleAccent: "Touch",
  addressLine1: "42 Flame Street",
  addressLine2: "Manchester, M1 4FR",
  phone: "+44 161 555 0142",
  email: "hello@fryo.co.uk",
  hoursDays: "Mon–Sun",
  hoursTime: "11:00 – 23:00",
};

export function Contact({ content, socials = [] }: { content?: ContactContent; socials?: SocialLink[] }) {
  const c = content ?? FALLBACK;
  const INFO = [
    { icon: <MapPin className="h-5 w-5" />, label: "Find Us", lines: [c.addressLine1, c.addressLine2] },
    { icon: <Phone className="h-5 w-5" />, label: "Call Us", lines: [c.phone] },
    { icon: <Mail className="h-5 w-5" />, label: "Email", lines: [c.email] },
    { icon: <Clock className="h-5 w-5" />, label: "Open", lines: [c.hoursDays, c.hoursTime] },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="font-display text-lg tracking-[0.4em] text-gold">
            {c.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
            {c.title} <span className="text-gold-grad">{c.titleAccent}</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-gold/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                {item.icon}
              </div>
              <h3 className="mt-4 font-display text-2xl tracking-wide text-cream">
                {item.label}
              </h3>
              <div className="mt-1 space-y-0.5">
                {item.lines.map((line) => (
                  <p key={line} className="text-sm text-cream/60">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <SocialLinks socials={socials} className="mt-6 justify-center" />
      </div>
    </section>
  );
}
