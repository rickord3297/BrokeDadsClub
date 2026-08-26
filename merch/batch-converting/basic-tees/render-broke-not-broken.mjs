import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(fileURLToPath(import.meta.url));
const font = readFileSync(join(root, "../Oswald.ttf")).toString("base64");
const teeBlank =
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-cream-tee-v2.png";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 520" width="2800" height="2080">
  <defs>
    <style>
      @font-face {
        font-family: "Oswald";
        src: url("data:font/ttf;base64,${font}") format("truetype");
        font-weight: 100 900;
      }
      .top { font-family: Oswald, sans-serif; font-weight: 600; fill: #2c5f63; text-anchor: middle; }
      .mid { font-family: Oswald, sans-serif; font-weight: 700; fill: #d97b51; text-anchor: middle; }
      .bot { font-family: Oswald, sans-serif; font-weight: 600; fill: #2c5f63; text-anchor: middle; }
    </style>
  </defs>
  <text class="top" x="350" y="130" font-size="92">Broke</text>
  <text class="mid" x="350" y="280" font-size="118">NOT</text>
  <text class="bot" x="350" y="430" font-size="92">Broken</text>
</svg>`;

const dir = join(root, "01-broke-does-not-mean-broken");
mkdirSync(dir, { recursive: true });
const print = join(dir, "print.png");
await sharp(Buffer.from(svg)).resize(2800, 2080).png().toFile(print);

const design = await sharp(print).resize({ width: 1200 }).png().toBuffer();
const dMeta = await sharp(design).metadata();
await sharp({
  create: {
    width: 1320,
    height: (dMeta.height ?? 1200) + 120,
    channels: 3,
    background: "#f9f4e8",
  },
})
  .composite([{ input: design, left: 60, top: 60 }])
  .png()
  .toFile(join(dir, "preview.png"));

const teeMeta = await sharp(teeBlank).metadata();
const w = teeMeta.width ?? 1024;
const h = teeMeta.height ?? 1024;
const designW = Math.round(w * 0.3);
const placed = await sharp(print).resize({ width: designW }).png().toBuffer();
await sharp(teeBlank)
  .composite([
    {
      input: placed,
      left: Math.round((w - designW) / 2),
      top: Math.round(h * 0.3),
    },
  ])
  .png()
  .toFile(join(dir, "tee-mockup.png"));

console.log("ok Broke NOT Broken");
