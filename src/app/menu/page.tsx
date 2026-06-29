import { getPublicMenu } from "@/server/menu";
import {
  getMenuSectionContent,
  getContactContent,
  getNewsletterContent,
} from "@/server/content";
import { getSocials, getNav, getFooterConfig, getTheme } from "@/server/appearance";
import { getPageMetadata } from "@/server/seo";
import { Menu } from "@/components/sections/Menu";
import { Perks } from "@/components/sections/Perks";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata("/menu");
}

export default async function MenuPage() {
  const [menu, menuSection, socials, contact, newsletter, nav, footerConfig, theme] = await Promise.all([
    getPublicMenu(),
    getMenuSectionContent(),
    getSocials(),
    getContactContent(),
    getNewsletterContent(),
    getNav(),
    getFooterConfig(),
    getTheme(),
  ]);

  return (
    <>
      <Menu items={menu} content={menuSection} />
      <Perks />
      <CTABand title="Build Your" titleAccent="Bag" ctaLabel="Start An Order" ctaHref="/menu" />
      <Footer
        socials={socials}
        contact={contact}
        newsletter={newsletter}
        navLinks={nav.links}
        footerConfig={footerConfig}
        theme={theme}
      />
    </>
  );
}
