"use server";

import { revalidatePath } from "next/cache";
import { updateReview, deleteReview, type ReviewStatus } from "@/server/reviews";

function revalidateReviews() {
  revalidatePath("/"); // homepage Testimonials
  revalidatePath("/fryo-kanji/reviews"); // admin
}

export async function setReviewStatusAction(id: string, status: ReviewStatus) {
  await updateReview(id, status === "Approved" ? { status } : { status, showOnHome: false });
  revalidateReviews();
  return { ok: true as const };
}

export async function toggleReviewHomeAction(id: string, showOnHome: boolean) {
  await updateReview(id, { showOnHome });
  revalidateReviews();
  return { ok: true as const };
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidateReviews();
  return { ok: true as const };
}
