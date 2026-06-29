"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FeaturedDrawer } from "@/components/layout/FeaturedDrawer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingCart } from "@/components/layout/FloatingCart";
import type { NavConfig, HeaderConfig, AnnouncementConfig } from "@/server/appearance";

export function Shell({
  children,
  nav,
  header,
  announcement,
}: {
  children: React.ReactNode;
  nav?: NavConfig;
  header?: HeaderConfig;
  announcement?: AnnouncementConfig;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/fryo-kanji") || pathname === "/login" || pathname?.startsWith("/invite")) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      {announcement && <AnnouncementBar announcement={announcement} />}
      <Navbar links={nav?.links} header={header} offsetTop={announcement?.enabled ? 36 : 0} />
      <FeaturedDrawer />
      <CartDrawer />
      <FloatingCart />
      <main>{children}</main>
    </SmoothScroll>
  );
}
