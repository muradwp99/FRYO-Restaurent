"use server";

import { revalidatePath } from "next/cache";
import {
  savePost,
  deletePost,
  updatePostStatus,
  updateCommentStatus,
  deleteComment,
  type PostInput,
  type PostStatus,
  type CommentStatus,
} from "@/server/blog";

function revalidatePosts() {
  revalidatePath("/fryo-kanji/blog/posts");
}

export async function savePostAction(input: PostInput) {
  const p = await savePost(input);
  revalidatePosts();
  return { ok: true as const, id: p.id };
}

export async function setPostStatusAction(id: string, status: PostStatus) {
  await updatePostStatus(id, status);
  revalidatePosts();
  return { ok: true as const };
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidatePosts();
  return { ok: true as const };
}

export async function setCommentStatusAction(id: string, status: CommentStatus) {
  await updateCommentStatus(id, status);
  revalidatePath("/fryo-kanji/blog/comments");
  return { ok: true as const };
}

export async function deleteCommentAction(id: string) {
  await deleteComment(id);
  revalidatePath("/fryo-kanji/blog/comments");
  return { ok: true as const };
}
