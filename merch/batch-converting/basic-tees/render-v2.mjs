import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(fileURLToPath(import.meta.url));
const font = readFileSync(join(root, "../Oswald.ttf")).toString("base64");
const teeBlank =
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-cream-tee-v2.png";

function face() {
  return `@font-face{font-family:"Oswald";src:url("data:font/ttf;base64,${font}") format("truetype");font-weight:100 900;}`;
}

async function teeMockup(printPath, outPath, ratio = 0.34) {
  const meta = await sharp(teeBlank).metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;
  const designW = Math.round(w * ratio);
  const placed = await sharp(printPath).resize({ width: designW }).png().toBuffer();
  const placedMeta = await sharp(placed).metadata();
  await sharp(teeBlank)
    .composite([
      {
        input: placed,
        left: Math.round((w - designW) / 2),
        top: Math.round(h * 0.3),
      },
    ])
    .png()
    .toFile(outPath);
  return placedMeta.height;
}

async function preview(printPath, outPath) {
  const design = await sharp(printPath).resize({ width: 1200 }).png().toBuffer();
  const meta = await sharp(design).metadata();
  await sharp({
    create: {
      width: 1320,
      height: (meta.height ?? 1200) + 120,
      channels: 3,
      background: "#f9f4e8",
    },
  })
    .composite([{ input: design, left: 60, top: 60 }])
    .png()
    .toFile(outPath);
}

const jobs = [
  {
    // Soft manifesto: quiet lead-in, one punch word
    dir: "01-broke-does-not-mean-broken",
    ratio: 0.33,
    w: 2800,
    h: 2200,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 550" width="2800" height="2200">
  <defs><style>${face()}
    .soft{font-family:Oswald,sans-serif;font-weight:500;fill:#2c5f63;text-anchor:middle}
    .punch{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
  </style></defs>
  <text class="soft" x="350" y="120" font-size="48" letter-spacing="1.5">Broke does not</text>
  <text class="soft" x="350" y="190" font-size="48" letter-spacing="1.5">mean</text>
  <line x1="250" y1="240" x2="450" y2="240" stroke="#d4a84b" stroke-width="2.5"/>
  <text class="punch" x="350" y="400" font-size="132" letter-spacing="2">broken</text>
</svg>`,
  },
  {
    // Two-line dignity lockup, tight and centered
    dir: "02-still-showing-up",
    ratio: 0.36,
    w: 2800,
    h: 1400,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" width="2800" height="1400">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#2c5f63;text-anchor:middle}
  </style></defs>
  <text class="a" x="350" y="130" font-size="72" letter-spacing="3">Still</text>
  <text class="b" x="350" y="250" font-size="92" letter-spacing="1">showing up</text>
</svg>`,
  },
  {
    // Brand stack: three short lines, club word in rust
    dir: "03-broke-dads-club",
    ratio: 0.28,
    w: 2400,
    h: 2400,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="2400" height="2400">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
  </style></defs>
  <text class="a" x="300" y="160" font-size="78" letter-spacing="2">Broke</text>
  <text class="a" x="300" y="280" font-size="78" letter-spacing="2">Dads</text>
  <line x1="210" y1="330" x2="390" y2="330" stroke="#d4a84b" stroke-width="2.5"/>
  <text class="b" x="300" y="460" font-size="96" letter-spacing="3">Club</text>
</svg>`,
  },
];

for (const job of jobs) {
  const dir = join(root, job.dir);
  mkdirSync(dir, { recursive: true });
  const print = join(dir, "print.png");
  await sharp(Buffer.from(job.svg)).resize(job.w, job.h).png().toFile(print);
  await preview(print, join(dir, "preview.png"));
  await teeMockup(print, join(dir, "tee-mockup.png"), job.ratio);
  console.log("ok", job.dir);
}
