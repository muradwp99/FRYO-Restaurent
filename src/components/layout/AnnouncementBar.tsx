"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnnouncementConfig } from "@/server/appearance";

export function AnnouncementBar({ announcement }: { announcement: AnnouncementConfig }) {
  if (!announcement.enabled || !announcement.message.trim()) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center bg-gold text-navy">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-5 text-center text-xs font-semibold tracking-wide sm:text-sm md:px-10">
        <span>{announcement.message}</span>
        {announcement.linkLabel.trim() && announcement.linkHref.trim() && (
          <Link
            href={announcement.linkHref}
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
          >
            {announcement.linkLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
