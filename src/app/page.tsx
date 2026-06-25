import { Hero } from "@/components/hero/Hero";
import { Lineup } from "@/components/sections/Lineup";
import { Menu } from "@/components/sections/Menu";
import { Steps } from "@/components/sections/Steps";
import { DealsStrip } from "@/components/sections/DealsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { ReserveCTA } from "@/components/sections/ReserveCTA";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Lineup />
      <Menu />
      <Steps />
      <DealsStrip />
      <Testimonials />
      <About />
      <ReserveCTA />
      <Contact />
      <Footer />
    </>
  );
}
