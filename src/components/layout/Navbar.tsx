"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu as MenuIcon, User, ShoppingBag, X, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { useUI } from "@/store/ui";
import { useCart, selectCount } from "@/store/cart";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string; type: "route" | "scroll" };

const LINKS: NavLink[] = [
  { label: "Home", href: "/", type: "route" },
  { label: "Menu", href: "#menu", type: "scroll" },
  { label: "Deals", href: "/deals", type: "route" },
  { label: "Reservations", href: "/reservations", type: "route" },
  { label: "Contact", href: "#contact", type: "scroll" },
];

export function Navbar() {
  const { openFeatured, openCart, navOpen, toggleNav, closeNav } = useUI();
  const count = useCart(selectCount);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (link: NavLink) => {
    closeNav();
    if (link.type === "route") {
      router.push(link.href);
      return;
    }
    // scroll link
    if (pathname === "/") scrollToId(link.href);
    else router.push(`/${link.href}`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-ink backdrop-blur-xl transition-all duration-500",
        scrolled
          ? "border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "border-white/5"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-10">
        {/* left: logo */}
        <Logo />

        {/* center/right: nav links (desktop) */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => go(l)}
                data-cursor=""
                className="group relative font-display text-lg tracking-wider text-cream/85 transition-colors hover:text-gold"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* off-canvas featured trigger */}
          <button
            onClick={openFeatured}
            data-cursor="FEATURED"
            aria-label="Open featured menu"
            className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-cream/90 transition-all hover:border-gold/60 hover:text-gold sm:px-4"
          >
            <Sparkles className="h-5 w-5" />
            <span className="hidden font-display text-base tracking-wider sm:inline">
              Featured
            </span>
          </button>

          <button
            aria-label="Account"
            data-cursor=""
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/90 transition-all hover:border-gold/60 hover:text-gold"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            onClick={openCart}
            aria-label="Open cart"
            data-cursor="CART"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/90 transition-all hover:border-gold/60 hover:text-gold"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 font-display text-xs text-navy">
                {count}
              </span>
            )}
          </button>

          {/* mobile nav toggle */}
          <button
            onClick={toggleNav}
            aria-label="Toggle navigation"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/90 lg:hidden"
          >
            {navOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu sheet */}
      <div
        className={cn(
          "overflow-hidden border-b border-white/5 bg-ink/95 backdrop-blur-xl transition-[max-height] duration-500 lg:hidden",
          navOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => go(l)}
                className="w-full py-3 text-left font-display text-2xl tracking-wider text-cream/90 hover:text-gold"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
