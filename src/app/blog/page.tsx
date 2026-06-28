import type { Metadata } from "next";
import { getPublishedPosts } from "@/server/blog";
import { getSocials } from "@/server/appearance";
import { getContactContent } from "@/server/content";
import { TextReveal } from "@/components/anim/TextReveal";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Recipes, kitchen secrets and the stories behind every FRYO build.",
};

export default async function BlogPage() {
  const [posts, socials, contact] = await Promise.all([getPublishedPosts(), getSocials(), getContactContent()]);

  return (
    <>
      <div className="mx-auto max-w-[1300px] px-5 pb-24 pt-32 md:px-10">
        <div className="mb-14">
          <span className="font-display text-base tracking-[0.4em] text-gold">The FRYO Journal</span>
          <TextReveal as="h1" by="words" className="mt-2 font-display text-6xl leading-none text-cream md:text-8xl">
            Fresh Off The Grill
          </TextReveal>
          <p className="mt-5 max-w-lg text-cream/60">
            Recipes, kitchen secrets and the stories behind every build — straight from the FRYO pass.
          </p>
        </div>

        <BlogGrid posts={posts} />
      </div>
      <Footer socials={socials} contact={contact} />
    </>
  );
}
