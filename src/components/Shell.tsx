"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { FeaturedDrawer } from "@/components/layout/FeaturedDrawer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingCart } from "@/components/layout/FloatingCart";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/fryo-kanji")) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <FeaturedDrawer />
      <CartDrawer />
      <FloatingCart />
      <main>{children}</main>
    </SmoothScroll>
  );
}
