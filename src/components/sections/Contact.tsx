"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, AtSign, Send, Globe } from "lucide-react";

const INFO = [
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Find Us",
    lines: ["42 Flame Street", "Manchester, M1 4FR"],
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Call Us",
    lines: ["+44 161 555 0142"],
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    lines: ["hello@fryo.co.uk"],
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Open",
    lines: ["Mon–Sun", "11:00 – 23:00"],
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="font-display text-lg tracking-[0.4em] text-gold">
            Say Hello
          </span>
          <h2 className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
            Get In <span className="text-gold-grad">Touch</span>
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

        <div className="mt-6 flex items-center justify-center gap-3">
          {[AtSign, Send, Globe].map((Icon, i) => (
            <a
              key={i}
              href="#"
              data-cursor=""
              aria-label="social"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/80 transition-all hover:border-gold/60 hover:text-gold"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
