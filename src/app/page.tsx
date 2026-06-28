import { Hero } from "@/components/hero/Hero";
import { Lineup } from "@/components/sections/Lineup";
import { Menu } from "@/components/sections/Menu";
import { Steps } from "@/components/sections/Steps";
import { DealsStrip } from "@/components/sections/DealsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getPublicMenu, getFeaturedMenu } from "@/server/menu";
import { getPublicDeals } from "@/server/deals";
import { getHomeTestimonials } from "@/server/reviews";
import { getContactContent, getAboutContent, getHeroContent, getStepsContent } from "@/server/content";
import { getSocials } from "@/server/appearance";
import { getPageMetadata } from "@/server/seo";
import { SchemaScript } from "@/components/SchemaScript";

// CMS-backed: always reflect the latest admin edits.
export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata("/");
}

export default async function Home() {
  const [menu, featured, deals, testimonials, contact, about, hero, steps, socials] = await Promise.all([
    getPublicMenu(),
    getFeaturedMenu(),
    getPublicDeals(),
    getHomeTestimonials(),
    getContactContent(),
    getAboutContent(),
    getHeroContent(),
    getStepsContent(),
    getSocials(),
  ]);
  return (
    <>
      <SchemaScript />
      <Hero scenes={hero.scenes} stats={hero.stats} />
      <Lineup items={featured} />
      <Menu items={menu} />
      <Steps content={steps} />
      <DealsStrip deals={deals} />
      <Testimonials reviews={testimonials} />
      <About content={about} />
      <Contact content={contact} socials={socials} />
      <Footer socials={socials} contact={contact} />
    </>
  );
}
