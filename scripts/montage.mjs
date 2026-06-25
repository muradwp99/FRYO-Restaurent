// Builds a labeled contact sheet of the frame sequence so we can see the whole arc.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Hero-video_frames/Hero-video_frames");
const OUT = process.env.OUT || path.resolve("scratch_montage.png");

// pick frames spread across 1..220 (source files are frame_001 .. frame_221, one gap)
const picks = (process.env.PICKS || "1,15,30,45,60,75,90,105,120,133,150,165,178,195,210,220")
  .split(",")
  .map((s) => parseInt(s.trim(), 10));
const COLS = 4;
const TW = 380;
const TH = 214; // 16:9

const label = (n) =>
  Buffer.from(
    `<svg width="${TW}" height="${TH}"><text x="10" y="30" font-size="34" fill="#F5C400" font-family="sans-serif" font-weight="bold" stroke="#001840" stroke-width="2">#${n}</text></svg>`
  );

const run = async () => {
  const tiles = [];
  for (const n of picks) {
    const file = path.join(SRC, `frame_${String(n).padStart(3, "0")}.png`);
    let buf;
    try {
      buf = await sharp(file).resize(TW, TH, { fit: "cover" }).toBuffer();
    } catch {
      // gap frame — try next number
      const file2 = path.join(SRC, `frame_${String(n + 1).padStart(3, "0")}.png`);
      buf = await sharp(file2).resize(TW, TH, { fit: "cover" }).toBuffer();
    }
    const tile = await sharp(buf)
      .composite([{ input: label(n), top: 0, left: 0 }])
      .toBuffer();
    tiles.push(tile);
  }

  const rows = Math.ceil(tiles.length / COLS);
  const canvas = sharp({
    create: {
      width: COLS * TW,
      height: rows * TH,
      channels: 3,
      background: { r: 0, g: 16, b: 43 },
    },
  });
  const composites = tiles.map((input, i) => ({
    input,
    left: (i % COLS) * TW,
    top: Math.floor(i / COLS) * TH,
  }));
  await canvas.composite(composites).png().toFile(OUT);
  console.log("wrote", OUT, "frames:", picks.join(","));
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
