"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Drawer({
  open,
  onClose,
  side = "left",
  title,
  subtitle,
  children,
  footer,
}: DrawerProps) {
  // lock body scroll + close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const x = side === "left" ? "-100%" : "100%";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x }}
        animate={{ x: 0 }}
        transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        className={`absolute top-0 flex h-full w-[min(420px,92vw)] flex-col bg-ink/95 backdrop-blur-xl ${
          side === "left"
            ? "left-0 border-r border-white/10"
            : "right-0 border-l border-white/10"
        }`}
      >
        {/* glow accents */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-6 py-6">
          <div>
            <h2 className="font-display text-4xl leading-none tracking-wide text-cream">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-cream/55">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            data-cursor=""
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-cream transition-colors hover:border-gold/60 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-thin relative flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="relative border-t border-white/10 bg-ink/80 px-6 py-5">
            {footer}
          </div>
        )}
      </motion.aside>
    </div>
  );
}
