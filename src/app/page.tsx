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
import {
  getContactContent,
  getAboutContent,
  getHeroContent,
  getStepsContent,
  getLineupContent,
  getMenuSectionContent,
  getDealsBlockContent,
  getTestimonialsContent,
  getNewsletterContent,
} from "@/server/content";
import { getSocials, getNav, getFooterConfig, getTheme } from "@/server/appearance";
import { getPageMetadata } from "@/server/seo";
import { SchemaScript } from "@/components/SchemaScript";

// CMS-backed: always reflect the latest admin edits.
export const revalidate = 300;

export function generateMetadata() {
  return getPageMetadata("/");
}

export default async function Home() {
  const [
    menu,
    featured,
    deals,
    autoReviews,
    contact,
    about,
    hero,
    steps,
    socials,
    lineup,
    menuSection,
    dealsBlock,
    testimonialsContent,
    newsletter,
    nav,
    footerConfig,
    theme,
  ] = await Promise.all([
    getPublicMenu(),
    getFeaturedMenu(),
    getPublicDeals(),
    getHomeTestimonials(),
    getContactContent(),
    getAboutContent(),
    getHeroContent(),
    getStepsContent(),
    getSocials(),
    getLineupContent(),
    getMenuSectionContent(),
    getDealsBlockContent(),
    getTestimonialsContent(),
    getNewsletterContent(),
    getNav(),
    getFooterConfig(),
    getTheme(),
  ]);

  const testimonials = testimonialsContent.autoPull
    ? autoReviews
    : testimonialsContent.manual.map((m) => ({ name: m.author, text: m.quote, stars: m.rating }));

  return (
    <>
      <SchemaScript />
      <Hero scenes={hero.scenes} stats={hero.stats} />
      <Lineup items={featured} content={lineup} />
      <Menu items={menu} content={menuSection} />
      <Steps content={steps} />
      <DealsStrip deals={deals} content={dealsBlock} />
      <Testimonials reviews={testimonials} header={{ eyebrow: testimonialsContent.eyebrow, title: testimonialsContent.title }} />
      <About content={about} />
      <Contact content={contact} socials={socials} />
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
