"use server";

import { revalidatePath } from "next/cache";
import { sendMessage, markThreadRead } from "@/server/chat";

function revalidateChat() {
  revalidatePath("/fryo-kanji/chat");
  revalidatePath("/fryo-kanji", "layout"); // sidebar messages badge
}

export async function sendMessageAction(threadId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false as const };
  const thread = await sendMessage(threadId, trimmed);
  revalidateChat();
  return { ok: true as const, thread };
}

export async function markThreadReadAction(threadId: string) {
  await markThreadRead(threadId);
  revalidateChat();
  return { ok: true as const };
}
