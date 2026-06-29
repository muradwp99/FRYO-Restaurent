import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, PenTool, ArrowUpRight } from "lucide-react";
import { getPostBySlug } from "@/server/blog";
import { getSocials } from "@/server/appearance";
import { getContactContent } from "@/server/content";
import { getBlogSeo } from "@/server/seo";
import { TextReveal } from "@/components/anim/TextReveal";
import { Reveal } from "@/components/anim/Reveal";
import { Footer } from "@/components/sections/Footer";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post, seo] = await Promise.all([getPostBySlug(slug), getBlogSeo(slug)]);
  if (!post) return { title: "Journal" };
  return { title: seo?.title || post.title, description: seo?.description || post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, socials, contact] = await Promise.all([getPostBySlug(slug), getSocials(), getContactContent()]);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n{2,}|\n/).filter((p) => p.trim());

  return (
    <>
      <article className="mx-auto max-w-[820px] px-5 pb-24 pt-32 md:px-10">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm tracking-widest text-cream/60 transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>

        <span className="font-display text-sm tracking-[0.4em] text-gold">{post.category}</span>
        <TextReveal as="h1" by="words" className="mt-3 font-display text-5xl leading-[0.95] text-cream md:text-7xl">
          {post.title}
        </TextReveal>

        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-cream/55">
          <span className="flex items-center gap-1.5"><PenTool className="h-4 w-4 text-gold/70" /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readingTime} min read</span>
          <span>{post.date}</span>
        </div>

        <div className="hairline my-8" />

        <Reveal stagger className="space-y-5">
          <p className="text-lg font-medium leading-relaxed text-cream/85">{post.excerpt}</p>
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-cream/70">{para}</p>
          ))}
        </Reveal>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs tracking-widest text-cream/60">#{t}</span>
            ))}
          </div>
        )}

        <Reveal className="mt-14 overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-10 text-center">
          <h2 className="font-display text-4xl leading-none text-cream md:text-5xl">Hungry now? <span className="text-gold-grad">We get it.</span></h2>
          <Link href="/#menu" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-display text-xl tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]">
            Build Your Order <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </article>
      <Footer socials={socials} contact={contact} />
    </>
  );
}
