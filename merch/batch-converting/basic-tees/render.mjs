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

async function teeMockup(printPath, outPath, ratio = 0.44) {
  const meta = await sharp(teeBlank).metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;
  const designW = Math.round(w * ratio);
  const placed = await sharp(printPath).resize({ width: designW }).png().toBuffer();
  await sharp(teeBlank)
    .composite([
      {
        input: placed,
        left: Math.round((w - designW) / 2),
        top: Math.round(h * 0.32),
      },
    ])
    .png()
    .toFile(outPath);
}

async function preview(printPath, outPath) {
  const design = await sharp(printPath).resize({ width: 1400 }).png().toBuffer();
  const meta = await sharp(design).metadata();
  await sharp({
    create: {
      width: 1520,
      height: (meta.height ?? 1400) + 120,
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
    dir: "01-broke-does-not-mean-broken",
    name: "Broke does not mean broken",
    ratio: 0.46,
    w: 3600,
    h: 1400,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 390" width="3600" height="1400">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
  </style></defs>
  <text class="a" x="500" y="140" font-size="78" letter-spacing="4">BROKE DOES NOT</text>
  <text class="a" x="500" y="240" font-size="78" letter-spacing="4">MEAN</text>
  <text class="b" x="500" y="360" font-size="110" letter-spacing="6">BROKEN</text>
</svg>`,
  },
  {
    dir: "02-still-showing-up",
    name: "Still Showing Up",
    ratio: 0.44,
    w: 3600,
    h: 900,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 250" width="3600" height="900">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
  </style></defs>
  <text class="a" x="500" y="170" font-size="92" letter-spacing="8">STILL SHOWING UP</text>
</svg>`,
  },
  {
    dir: "03-broke-dads-club",
    name: "Broke Dads Club",
    ratio: 0.48,
    w: 3600,
    h: 720,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200" width="3600" height="720">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
  </style></defs>
  <text class="a" x="500" y="140" font-size="78" letter-spacing="10">BROKE DADS CLUB</text>
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
