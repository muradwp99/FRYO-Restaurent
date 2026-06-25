// Builds the web-ready hero frame sequence from the 4K PNG source, REORDERED
// into the desired narrative and re-indexed sequentially.
//
//   Segment 1  hand posture -> scatter   source 66 -> 1   (reversed)
//   Segment 2  sauce dripping            source 70 -> 132 (forward)
//   Segment 3  pull back to hero         source 179 -> 220 (forward)
//
// Output (two sizes, so each device loads only what it needs):
//   public/frames/0001.webp     2560px q92  (desktop / retina, full quality)
//   public/frames-sm/0001.webp  1280px q82  (phones / small screens, light)
// Run: node scripts/optimize-frames.mjs

import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = path.resolve("Hero-video_frames/Hero-video_frames");
const OUT_DIR = path.resolve("public/frames");
const SIZES = [
  { dir: path.resolve("public/frames"), width: 2560, quality: 92 },
  { dir: path.resolve("public/frames-sm"), width: 1280, quality: 82 },
];
const CONCURRENCY = 6;

function range(a, b) {
  const r = [];
  if (a <= b) for (let i = a; i <= b; i++) r.push(i);
  else for (let i = a; i >= b; i--) r.push(i);
  return r;
}

// playback order in SOURCE frame numbers
const ORDER = [
  ...range(66, 1), // seg1: hand -> scatter (reverse)  -> 66 frames
  ...range(70, 132), // seg2: sauce dripping           -> 63 frames
  ...range(179, 220), // seg3: pull back to hero        -> 42 frames
];

// resolve a source file, tolerating the single missing frame (218)
function sourceFile(n) {
  for (const cand of [n, n - 1, n + 1, n - 2, n + 2]) {
    const f = path.join(SRC_DIR, `frame_${String(cand).padStart(3, "0")}.png`);
    if (existsSync(f)) return f;
  }
  return null;
}

async function run() {
  for (const s of SIZES) {
    await rm(s.dir, { recursive: true, force: true });
    await mkdir(s.dir, { recursive: true });
  }

  const all = await readdir(SRC_DIR);
  if (all.filter((f) => f.endsWith(".png")).length === 0) {
    console.error("No PNG frames in", SRC_DIR);
    process.exit(1);
  }

  const count = ORDER.length;
  const pad = 4;
  console.log(
    `Building ${count} frames x ${SIZES.length} sizes (${SIZES.map(
      (s) => s.width + "px"
    ).join(", ")}), reordered...`
  );

  let done = 0;
  const bytes = SIZES.map(() => 0);

  async function processOne(srcNum, outIndex) {
    const file = sourceFile(srcNum);
    if (!file) throw new Error(`missing source for ${srcNum}`);
    const seq = String(outIndex + 1).padStart(pad, "0");
    const base = sharp(file);
    for (let si = 0; si < SIZES.length; si++) {
      const s = SIZES[si];
      const buf = await base
        .clone()
        .resize({ width: s.width, withoutEnlargement: true })
        .webp({ quality: s.quality, effort: 6, smartSubsample: true })
        .toBuffer();
      await writeFile(path.join(s.dir, `${seq}.webp`), buf);
      bytes[si] += buf.length;
    }
    done++;
    if (done % 20 === 0 || done === count) {
      process.stdout.write(
        `  ${done}/${count} (${SIZES.map(
          (s, i) => (bytes[i] / 1048576).toFixed(1) + "MB"
        ).join(" / ")})\n`
      );
    }
  }

  let cursor = 0;
  async function worker() {
    while (cursor < ORDER.length) {
      const i = cursor++;
      await processOne(ORDER[i], i);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // segment boundaries in OUTPUT-frame index space (for aligning hero text)
  const seg1 = 66; // frames 0..65
  const seg2 = seg1 + 63; // frames 66..128
  const manifest = {
    count,
    pad,
    sizes: SIZES.map((s) => ({ dir: path.basename(s.dir), width: s.width })),
    segments: [
      { name: "scatter", startIndex: 0, endIndex: seg1 - 1 },
      { name: "sauce", startIndex: seg1, endIndex: seg2 - 1 },
      { name: "hero", startIndex: seg2, endIndex: count - 1 },
    ],
    boundaries: [seg1 / count, seg2 / count],
  };
  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(
    `Done. ${count} frames. ` +
      SIZES.map(
        (s, i) =>
          `${path.basename(s.dir)}=${(bytes[i] / 1048576).toFixed(1)}MB`
      ).join(" / ") +
      `. boundaries=${manifest.boundaries.map((b) => b.toFixed(3)).join(", ")}`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
