import { listReviews } from "@/server/reviews";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await listReviews();
  return <ReviewsManager reviews={reviews} />;
}
