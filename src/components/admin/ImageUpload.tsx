"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, X, Link as LinkIcon } from "lucide-react";

/**
 * Drag-and-drop (or click / paste-URL) image field. Uploads to /api/upload,
 * which stores the file in the DB and returns a /api/media/<id> URL. Calls
 * onChange with the resulting URL. Falls back to a manual URL input too.
 */
export function ImageUpload({
  value,
  onChange,
  label = "Image",
  className = "",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  async function upload(file: File) {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-slate-400 tracking-wide">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <LinkIcon className="w-3 h-3" /> {showUrl ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors p-4 text-center ${
          dragOver ? "border-gold/60 bg-gold/5" : "border-white/12 bg-royal/20 hover:border-white/25"
        }`}
      >
        {value ? (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="mx-auto max-h-36 rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-slate-300 hover:text-rose-400 border border-white/10"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="mt-2 text-[11px] text-slate-500">Click or drop to replace</p>
          </div>
        ) : (
          <>
            {busy ? <Loader2 className="w-6 h-6 text-gold animate-spin" /> : <UploadCloud className="w-6 h-6 text-slate-400" />}
            <p className="text-sm text-slate-300 tracking-wide">{busy ? "Uploading…" : "Drag & drop an image, or click to browse"}</p>
            <p className="text-[11px] text-slate-500">PNG, JPG, WebP, GIF · up to 5 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>

      {showUrl && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /api/media/…"
          className="mt-2 w-full px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide"
        />
      )}

      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
