// Generates square product thumbnails + a hero poster from the optimized frames.
// Run: node scripts/crop-products.mjs

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const FRAMES = path.resolve("public/frames");
const OUT = path.resolve("public/products");

// frames are 1600x900. The burger sits centered, lower-middle.
const SQUARE = { left: 430, top: 70, width: 760, height: 760 };

const jobs = [
  { src: "0220.webp", out: "assembled.webp", crop: SQUARE },   // fully stacked cheeseburger
  { src: "0150.webp", out: "stack.webp", crop: SQUARE },       // near-assembled
  { src: "0080.webp", out: "build.webp", crop: SQUARE },       // mid build
  { src: "0010.webp", out: "explode.webp", crop: SQUARE },     // ingredients falling
];

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const job of jobs) {
    const buf = await sharp(path.join(FRAMES, job.src))
      .extract(job.crop)
      .resize(640, 640)
      .webp({ quality: 82 })
      .toBuffer();
    await writeFile(path.join(OUT, job.out), buf);
    console.log(`${job.out}  ${(buf.length / 1024).toFixed(0)} KB`);
  }

  // social/OG image (full last frame at moderate quality)
  const og = await sharp(path.join(FRAMES, "0220.webp"))
    .resize(1200, 630, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer();
  await writeFile(path.resolve("public/og.webp"), og);
  console.log(`og.webp  ${(og.length / 1024).toFixed(0)} KB`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
