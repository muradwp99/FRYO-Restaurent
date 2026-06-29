import { listThreads } from "@/server/chat";
import { ChatClient } from "@/components/admin/chat/ChatClient";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const threads = await listThreads();
  return <ChatClient threads={threads} />;
}
