import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type ReviewStatus = "Pending" | "Approved";

export type AdminReview = {
  id: string;
  customer: string;
  rating: number;
  item: string;
  comment: string;
  date: string;
  helpful: number;
  status: ReviewStatus;
  showOnHome: boolean;
};

/** Shape consumed by the homepage Testimonials marquee. */
export type Testimonial = { name: string; text: string; stars: number };

const COLLECTION = "reviews";

const seed: AdminReview[] = [
  { id: "rv-1", customer: "Alex Johnson", rating: 5, item: "Classic Smash Burger", comment: "Absolutely incredible! The patty was perfectly smashed and the sauce was chef's kiss. Best burger I've had in NYC.", date: "28 Jun 2026", helpful: 14, status: "Approved", showOnHome: true },
  { id: "rv-2", customer: "Maria Garcia", rating: 5, item: "Super Charger Wrap", comment: "The wrap was massive and packed with flavor. Fresh ingredients, great price. Will definitely be back!", date: "27 Jun 2026", helpful: 9, status: "Approved", showOnHome: true },
  { id: "rv-3", customer: "James Lee", rating: 4, item: "BBQ Stack Burger", comment: "Really solid burger. The BBQ sauce is house-made and you can tell. Fries could be a bit crispier.", date: "26 Jun 2026", helpful: 7, status: "Approved", showOnHome: true },
  { id: "rv-4", customer: "Priya Patel", rating: 5, item: "FRYO Fries (Large)", comment: "These fries are unreal. Perfectly seasoned, super crispy. I ordered them twice in the same visit!", date: "25 Jun 2026", helpful: 21, status: "Approved", showOnHome: true },
  { id: "rv-5", customer: "Lily Thompson", rating: 5, item: "Classic Smash Burger", comment: "FRYO is my go-to spot now. The quality is consistent every time. The staff are super friendly too.", date: "24 Jun 2026", helpful: 18, status: "Approved", showOnHome: true },
  { id: "rv-6", customer: "Ryan Chen", rating: 3, item: "BBQ Stack Burger", comment: "Good burger overall but had to wait about 25 minutes during lunch rush. The food was worth it though.", date: "22 Jun 2026", helpful: 4, status: "Pending", showOnHome: false },
  { id: "rv-7", customer: "Sara Kim", rating: 4, item: "Super Charger Wrap", comment: "Really enjoyed the wrap. Great value for money. The lemonade paired perfectly with it.", date: "20 Jun 2026", helpful: 11, status: "Approved", showOnHome: true },
];

export async function listReviews(): Promise<AdminReview[]> {
  return readCollection<AdminReview>(COLLECTION, seed);
}

/** Approved + flagged reviews, mapped to the Testimonials shape. */
export async function getHomeTestimonials(): Promise<Testimonial[]> {
  const rows = await listReviews();
  return rows
    .filter((r) => r.status === "Approved" && r.showOnHome)
    .map((r) => ({ name: r.customer, text: r.comment, stars: Math.round(r.rating) }));
}

export type ReviewInput = Omit<AdminReview, "id" | "helpful"> & { id?: string; helpful?: number };

export async function saveReview(input: ReviewInput): Promise<AdminReview> {
  const rows = await listReviews();
  if (input.id) {
    let updated: AdminReview | null = null;
    const next = rows.map((r) => {
      if (r.id !== input.id) return r;
      updated = { ...r, ...input, id: r.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.customer || "review", rows.map((r) => r.id));
  const review: AdminReview = { helpful: 0, ...input, id };
  await writeCollection(COLLECTION, [review, ...rows]);
  return review;
}

export async function updateReview(id: string, patch: Partial<AdminReview>): Promise<void> {
  const rows = await listReviews();
  await writeCollection(COLLECTION, rows.map((r) => (r.id === id ? { ...r, ...patch, id } : r)));
}

export async function deleteReview(id: string): Promise<void> {
  const rows = await listReviews();
  await writeCollection(COLLECTION, rows.filter((r) => r.id !== id));
}
