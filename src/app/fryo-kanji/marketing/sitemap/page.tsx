import { ExternalLink, Map as MapIcon } from "lucide-react";
import { getSitemapEntries } from "@/server/sitemap";

export const dynamic = "force-dynamic";

const typeStyle: Record<string, string> = {
  Page: "bg-gold/10 text-gold",
  "Menu item": "bg-blue-400/10 text-blue-300",
  "Blog post": "bg-violet-400/10 text-violet-300",
};

export default async function SitemapPage() {
  const { base, entries } = await getSitemapEntries();

  return (
    <div className="space-y-5 max-w-275">
      <div className="bg-ink-2 rounded-xl border border-gold/30 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0"><MapIcon className="w-4.5 h-4.5 text-gold" /></div>
        <div className="flex-1">
          <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
            Auto-generated from your live pages, menu items &amp; published posts. Submit it to search engines.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold hover:bg-gold-light text-navy px-3 py-1.5 rounded-lg transition-colors tracking-wide">
              /sitemap.xml <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="/robots.txt" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-medium border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white px-3 py-1.5 rounded-lg transition-colors tracking-wide">
              /robots.txt <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm tracking-wide">{entries.length} URLs</h3>
          <span className="text-xs text-slate-500 font-mono tracking-wide">{base}</span>
        </div>
        <div className="divide-y divide-white/5">
          {entries.map((e) => (
            <div key={e.path} className="flex items-center gap-3 px-5 py-3 hover:bg-royal/10 transition-colors">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide shrink-0 w-20 text-center ${typeStyle[e.type] ?? "bg-white/5 text-slate-300"}`}>{e.type}</span>
              <span className="font-mono text-xs text-slate-300 tracking-wide flex-1 truncate">{e.path}</span>
              <span className="text-xs text-slate-600 tracking-wide shrink-0">priority {e.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
