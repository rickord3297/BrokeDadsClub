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

async function teeMockup(printPath, outPath, ratio = 0.28) {
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
        top: Math.round(h * 0.3),
      },
    ])
    .png()
    .toFile(outPath);
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

// 1) BDC monogram crest — almost no language
const monogram = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="3600" height="3600">
  <defs><style>${face()}.t{font-family:Oswald,sans-serif;font-weight:600;fill:#f9f4e8;text-anchor:middle}</style></defs>
  <circle cx="500" cy="500" r="492" fill="#2c5f63"/>
  <circle cx="500" cy="500" r="460" fill="none" stroke="#d4a84b" stroke-width="16"/>
  <circle cx="500" cy="500" r="430" fill="none" stroke="#d97b51" stroke-width="4"/>
  <text class="t" x="500" y="580" font-size="280" letter-spacing="18">BDC</text>
</svg>`;

// 2) Single quiet word mark
const still = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 520" width="3600" height="1872">
  <defs><style>${face()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:500;fill:#d97b51;text-anchor:middle}
  </style></defs>
  <text class="a" x="500" y="240" font-size="140" letter-spacing="16">STILL HERE</text>
  <text class="b" x="500" y="400" font-size="36" letter-spacing="12">BDC</text>
</svg>`;

// 3) Tiny brand stamp only — one line
const stamp = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 280" width="3600" height="1008">
  <defs><style>${face()}.t{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}</style></defs>
  <line x1="80" y1="80" x2="280" y2="80" stroke="#d4a84b" stroke-width="4"/>
  <line x1="720" y1="80" x2="920" y2="80" stroke="#d4a84b" stroke-width="4"/>
  <text class="t" x="500" y="175" font-size="72" letter-spacing="10">BROKE DADS CLUB</text>
</svg>`;

const jobs = [
  { dir: "01-bdc-crest", svg: monogram, square: true, ratio: 0.26, name: "BDC Crest" },
  { dir: "02-still-here", svg: still, square: false, w: 3600, h: 1872, ratio: 0.42, name: "Still Here" },
  { dir: "03-club-stamp", svg: stamp, square: false, w: 3600, h: 1008, ratio: 0.48, name: "Club Stamp" },
];

mkdirSync(join(root), { recursive: true });
for (const job of jobs) {
  const dir = join(root, job.dir);
  mkdirSync(dir, { recursive: true });
  const print = join(dir, "print.png");
  if (job.square) {
    await sharp(Buffer.from(job.svg)).resize(3600, 3600).png().toFile(print);
  } else {
    await sharp(Buffer.from(job.svg)).resize(job.w, job.h).png().toFile(print);
  }
  await preview(print, join(dir, "preview.png"));
  await teeMockup(print, join(dir, "tee-mockup.png"), job.ratio);
  console.log("ok", job.dir);
}
