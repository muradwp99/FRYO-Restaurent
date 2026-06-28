"use client";

import { Camera, Share2, Hash, Play, Music2, Globe, type LucideIcon } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/server/appearance";

const ICONS: Record<SocialPlatform, LucideIcon> = {
  Instagram: Camera,
  Facebook: Share2,
  Twitter: Hash,
  YouTube: Play,
  TikTok: Music2,
  Website: Globe,
};

export function SocialLinks({ socials, className = "" }: { socials: SocialLink[]; className?: string }) {
  if (!socials?.length) return null;
  return (
    <div className={`flex gap-3 ${className}`}>
      {socials.map((s) => {
        const Icon = ICONS[s.platform] ?? Globe;
        return (
          <a
            key={s.platform + s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor=""
            aria-label={s.platform}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/80 transition-all hover:border-gold/60 hover:text-gold"
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
