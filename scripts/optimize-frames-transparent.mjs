// Converts the transparent burger PNGs (public/frames-transparent/N.png, 1..171,
// already in playback order) into lightweight WebP-with-alpha frame sets.
//   public/frames-t/0001.webp     1920px  (desktop)
//   public/frames-t-sm/0001.webp  1080px  (mobile)
// Run: node scripts/optimize-frames-transparent.mjs

import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/frames-transparent");
const SIZES = [
  { dir: path.resolve("public/frames-t"), width: 1920, quality: 86 },
  { dir: path.resolve("public/frames-t-sm"), width: 1080, quality: 80 },
];
const CONCURRENCY = 6;

async function run() {
  const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));
  const count = files.length;
  if (!count) {
    console.error("No PNGs in", SRC);
    process.exit(1);
  }
  for (const s of SIZES) {
    await rm(s.dir, { recursive: true, force: true });
    await mkdir(s.dir, { recursive: true });
  }
  const pad = 4;
  console.log(`Converting ${count} transparent frames -> ${SIZES.map((s) => s.width + "px").join(", ")}...`);

  let done = 0;
  const bytes = SIZES.map(() => 0);

  async function processOne(n) {
    const file = path.join(SRC, `${n}.png`);
    const seq = String(n).padStart(pad, "0");
    const base = sharp(file);
    for (let si = 0; si < SIZES.length; si++) {
      const s = SIZES[si];
      const buf = await base
        .clone()
        .resize({ width: s.width, withoutEnlargement: true })
        .webp({ quality: s.quality, alphaQuality: 92, effort: 6 })
        .toBuffer();
      await writeFile(path.join(s.dir, `${seq}.webp`), buf);
      bytes[si] += buf.length;
    }
    done++;
    if (done % 20 === 0 || done === count)
      process.stdout.write(`  ${done}/${count} (${SIZES.map((s, i) => (bytes[i] / 1048576).toFixed(1) + "MB").join(" / ")})\n`);
  }

  let cursor = 1;
  async function worker() {
    while (cursor <= count) {
      const n = cursor++;
      await processOne(n);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const seg1 = 66;
  const seg2 = seg1 + 63;
  const manifest = {
    count,
    pad,
    transparent: true,
    boundaries: [seg1 / count, seg2 / count],
  };
  await writeFile(path.join(SIZES[0].dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done. ${SIZES.map((s, i) => `${path.basename(s.dir)}=${(bytes[i] / 1048576).toFixed(1)}MB`).join(" / ")}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
