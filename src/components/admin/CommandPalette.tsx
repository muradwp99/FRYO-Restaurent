"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { flattenNav, type FlatNavItem } from "./navConfig";

/** Lightweight subsequence fuzzy match → score (lower is better), or -1 if no match. */
function fuzzyScore(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let ti = 0;
  let score = 0;
  let lastHit = -1;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    if (lastHit !== -1) score += found - lastHit; // reward adjacency
    lastHit = found;
    ti = found + 1;
  }
  return score + (t.startsWith(q) ? -5 : 0);
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = useMemo(() => flattenNav(), []);

  const results = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    return allItems
      .map((it) => ({ it, score: fuzzyScore(query, `${it.group} ${it.label}`) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 10)
      .map((r) => r.it);
  }, [query, allItems]);

  // Reset + focus when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (item?: FlatNavItem) => {
    if (!item) return;
    router.push(item.href as never);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-ink-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search className="w-4.5 h-4.5 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
            placeholder="Search pages…  (e.g. orders, modifiers, SEO)"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none tracking-wide"
          />
          <kbd className="hidden sm:block text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5 tracking-wide">ESC</kbd>
        </div>

        {/* Results */}
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-500 tracking-wide">No matches for “{query}”.</li>
          ) : (
            results.map((it, i) => {
              const Icon = it.icon;
              const isActive = i === active;
              return (
                <li key={it.href}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-gold/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-gold/15" : "bg-white/5"}`}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-slate-400"}`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-white tracking-wide truncate">{it.label}</span>
                      <span className="block text-[11px] text-slate-500 tracking-wide">{it.group}</span>
                    </span>
                    {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/8 text-[11px] text-slate-500 tracking-wide">
          <span className="flex items-center gap-1"><kbd className="border border-white/10 rounded px-1">↑</kbd><kbd className="border border-white/10 rounded px-1">↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="border border-white/10 rounded px-1">↵</kbd> open</span>
        </div>
      </div>
    </div>
  );
}
