import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = dirname(fileURLToPath(import.meta.url));
const font = readFileSync(join(dir, "Oswald.ttf")).toString("base64");

const source = sharp(join(dir, "mascot-source.png"));
const { data, info } = await source
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(data);
let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const creamDist = Math.hypot(r - 253, g - 246, b - 230);
    const isCream = creamDist < 26 && saturation < 32 && r > 235 && b > 210;
    if (isCream) {
      pixels[i + 3] = 0;
    } else {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = 4;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(info.width - 1, maxX + pad);
maxY = Math.min(info.height - 1, maxY + pad);

const dog = await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .png()
  .toBuffer();

const dogMeta = await sharp(dog).metadata();
const printW = 3600;
const dogW = 2800;
const dogH = Math.round(
  ((dogMeta.height ?? 1) / (dogMeta.width ?? 1)) * dogW,
);
const resizedDog = await sharp(dog)
  .resize(dogW, dogH)
  .png()
  .toBuffer();

const typeH = 220;
const dogTop = 40;
const typeTop = dogTop + dogH + 12;
const printH = typeTop + typeH + 40;
const typeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${printW}" height="${typeH}" viewBox="0 0 ${printW} ${typeH}">
  <defs>
    <style>
      @font-face {
        font-family: "Oswald";
        src: url("data:font/ttf;base64,${font}") format("truetype");
        font-weight: 100 900;
      }
    </style>
  </defs>
  <text x="1800" y="155" text-anchor="middle" font-family="Oswald, sans-serif" font-size="168" font-weight="600">
    <tspan fill="#2c5f63" letter-spacing="12">BROKE DADS </tspan>
    <tspan fill="#d97b51" font-weight="700" letter-spacing="14">CLUB</tspan>
  </text>
</svg>`;

const print = sharp({
  create: {
    width: printW,
    height: printH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
});

await print
  .composite([
    { input: resizedDog, left: Math.round((printW - dogW) / 2), top: dogTop },
    { input: Buffer.from(typeSvg), left: 0, top: typeTop },
  ])
  .png()
  .toFile(join(dir, "print.png"));

const teePath =
  process.argv[2] ??
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-cream-tee.png";
const teeMeta = await sharp(teePath).metadata();
const teeW = teeMeta.width ?? 1024;
const teeH = teeMeta.height ?? 1024;
const designW = Math.round(teeW * 0.38);
const placed = await sharp(join(dir, "print.png"))
  .resize({ width: designW })
  .png()
  .toBuffer();
const placedMeta = await sharp(placed).metadata();

await sharp(teePath)
  .composite([
    {
      input: placed,
      left: Math.round((teeW - designW) / 2),
      top: Math.round(teeH * 0.28),
    },
  ])
  .png()
  .toFile(join(dir, "tee-mockup.png"));

const previewW = 1600;
const previewDesign = await sharp(join(dir, "print.png"))
  .resize({ width: previewW })
  .png()
  .toBuffer();
const previewMeta = await sharp(previewDesign).metadata();
await sharp({
  create: {
    width: previewW + 160,
    height: (previewMeta.height ?? 1) + 160,
    channels: 3,
    background: "#f9f4e8",
  },
})
  .composite([{ input: previewDesign, left: 80, top: 80 }])
  .png()
  .toFile(join(dir, "preview.png"));

console.log(
  JSON.stringify(
    {
      dogBox: { minX, minY, maxX, maxY },
      print: { width: printW, height: printH },
      tee: {
        teeW,
        teeH,
        designW,
        designH: placedMeta.height,
      },
    },
    null,
    2,
  ),
);
