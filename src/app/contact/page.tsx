import { getContactContent, getNewsletterContent } from "@/server/content";
import { getSocials, getNav, getFooterConfig, getTheme } from "@/server/appearance";
import { getPageMetadata } from "@/server/seo";
import { getHomeTestimonials } from "@/server/reviews";
import { Contact } from "@/components/sections/Contact";
import { ContactForm } from "@/components/contact/ContactForm";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata("/contact");
}

export default async function ContactPage() {
  const [contact, newsletter, socials, nav, footerConfig, theme, reviews] = await Promise.all([
    getContactContent(),
    getNewsletterContent(),
    getSocials(),
    getNav(),
    getFooterConfig(),
    getTheme(),
    getHomeTestimonials(),
  ]);

  return (
    <>
      <Contact content={contact} socials={socials} />
      <ContactForm />
      <Testimonials reviews={reviews} header={{ eyebrow: "Happy Customers", title: "What People Say" }} />
      <FAQ />
      <CTABand title="Craving" titleAccent="FRYO?" subtitle="Skip the queue — browse the menu and build your order in seconds." ctaLabel="See The Menu" ctaHref="/menu" />
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
