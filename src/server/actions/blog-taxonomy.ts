"use server";

import { revalidatePath } from "next/cache";
import {
  saveCategory, deleteCategory,
  saveTag, deleteTag,
  saveAuthor, deleteAuthor,
} from "@/server/blog-taxonomy";

export async function saveBlogCategoryAction(input: { id?: string; name: string }) {
  await saveCategory(input);
  revalidatePath("/fryo-kanji/blog/categories");
  return { ok: true as const };
}
export async function deleteBlogCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/fryo-kanji/blog/categories");
  return { ok: true as const };
}

export async function saveBlogTagAction(input: { id?: string; name: string }) {
  await saveTag(input);
  revalidatePath("/fryo-kanji/blog/tags");
  return { ok: true as const };
}
export async function deleteBlogTagAction(id: string) {
  await deleteTag(id);
  revalidatePath("/fryo-kanji/blog/tags");
  return { ok: true as const };
}

export async function saveBlogAuthorAction(input: { id?: string; name: string; email: string; bio: string }) {
  await saveAuthor(input);
  revalidatePath("/fryo-kanji/blog/authors");
  return { ok: true as const };
}
export async function deleteBlogAuthorAction(id: string) {
  await deleteAuthor(id);
  revalidatePath("/fryo-kanji/blog/authors");
  return { ok: true as const };
}
