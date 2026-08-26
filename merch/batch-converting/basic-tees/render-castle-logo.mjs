import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(fileURLToPath(import.meta.url));
const repo = join(root, "../../..");
const logoPath = join(repo, "public/brand/club-logo.png");
const teeBlank =
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-cream-tee-v2.png";

const dir = join(root, "04-castle-logo");
mkdirSync(dir, { recursive: true });

const source = sharp(logoPath);
const { data, info } = await source.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const pixels = Buffer.from(data);

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const dist = Math.hypot(r - 249, g - 244, b - 232);
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (dist < 28 && sat < 35 && r > 230) {
      pixels[i + 3] = 0;
    }
  }
}

const printW = 3200;
const printPath = join(dir, "print.png");
await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .resize(printW, printW)
  .png()
  .toFile(printPath);

const previewDesign = await sharp(printPath).resize({ width: 1100 }).png().toBuffer();
const previewMeta = await sharp(previewDesign).metadata();
await sharp({
  create: {
    width: 1220,
    height: (previewMeta.height ?? 1100) + 120,
    channels: 3,
    background: "#f9f4e8",
  },
})
  .composite([{ input: previewDesign, left: 60, top: 60 }])
  .png()
  .toFile(join(dir, "preview.png"));

const teeMeta = await sharp(teeBlank).metadata();
const w = teeMeta.width ?? 1024;
const h = teeMeta.height ?? 1024;
const designW = Math.round(w * 0.34);
const placed = await sharp(printPath).resize({ width: designW }).png().toBuffer();
await sharp(teeBlank)
  .composite([
    {
      input: placed,
      left: Math.round((w - designW) / 2),
      top: Math.round(h * 0.28),
    },
  ])
  .png()
  .toFile(join(dir, "tee-mockup.png"));

console.log("ok castle logo tee", { printW, designW });
