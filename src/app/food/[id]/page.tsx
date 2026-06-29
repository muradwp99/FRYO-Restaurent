import { notFound } from "next/navigation";
import { getMenuItem } from "@/server/menu";
import { getCustomizeOptions } from "@/server/modifiers";
import { getFoodSeo } from "@/server/seo";
import { getApprovedReviewsForItem } from "@/server/reviews";
import { getSocials, getNav, getFooterConfig, getTheme } from "@/server/appearance";
import { getContactContent, getNewsletterContent } from "@/server/content";
import { FoodCustomizer } from "@/components/food/FoodCustomizer";
import { ProductReviews } from "@/components/sections/ProductReviews";
import { Footer } from "@/components/sections/Footer";

// CMS-backed: reflect admin edits to this item immediately.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, seo] = await Promise.all([getMenuItem(id), getFoodSeo(id)]);
  if (!item) return { title: "FRYO" };
  return {
    title: seo?.title || `${item.name} — FRYO`,
    description: seo?.description || item.description,
  };
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, options] = await Promise.all([getMenuItem(id), getCustomizeOptions()]);
  if (!item || item.status === "Hidden") notFound();

  const [itemReviews, socials, contact, newsletter, nav, footerConfig, theme] = await Promise.all([
    getApprovedReviewsForItem(item.name),
    getSocials(),
    getContactContent(),
    getNewsletterContent(),
    getNav(),
    getFooterConfig(),
    getTheme(),
  ]);

  const reviews = itemReviews.map((r) => ({
    id: r.id,
    customer: r.customer,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
  }));

  return (
    <>
      <FoodCustomizer item={item} options={options} />
      <ProductReviews reviews={reviews} title={`${item.name} Reviews`} />
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
