"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostForm, emptyPost } from "@/components/admin/blog/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/fryo-kanji/blog/posts" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
        <ArrowLeft className="w-4 h-4" /> Back to Posts
      </Link>
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <h1 className="text-xl font-bold text-white tracking-tight mb-5">New Post</h1>
        <PostForm
          initial={emptyPost}
          submitLabel="Create Post"
          onDone={() => router.push("/fryo-kanji/blog/posts")}
          onCancel={() => router.push("/fryo-kanji/blog/posts")}
        />
      </div>
    </div>
  );
}
