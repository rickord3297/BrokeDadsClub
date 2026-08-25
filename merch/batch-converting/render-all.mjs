import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(fileURLToPath(import.meta.url));
const font = readFileSync(join(root, "Oswald.ttf")).toString("base64");
const teeBlank =
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-cream-tee-v2.png";
const mugBlank =
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/blank-mug-v2.png";

function fontFace() {
  return `@font-face{font-family:"Oswald";src:url("data:font/ttf;base64,${font}") format("truetype");font-weight:100 900;}`;
}

async function writePng(svg, outPath, size = 3600) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
}

async function teeMockup(printPath, outPath, designRatio = 0.36) {
  const teeMeta = await sharp(teeBlank).metadata();
  const w = teeMeta.width ?? 1024;
  const h = teeMeta.height ?? 1024;
  const designW = Math.round(w * designRatio);
  const placed = await sharp(printPath).resize({ width: designW }).png().toBuffer();
  const placedMeta = await sharp(placed).metadata();
  await sharp(teeBlank)
    .composite([
      {
        input: placed,
        left: Math.round((w - designW) / 2),
        top: Math.round(h * 0.26),
      },
    ])
    .png()
    .toFile(outPath);
  return { designW, designH: placedMeta.height };
}

async function mugMockup(printPath, outPath) {
  const mugMeta = await sharp(mugBlank).metadata();
  const w = mugMeta.width ?? 1024;
  const h = mugMeta.height ?? 1024;
  const badge = Math.round(w * 0.32);
  const placed = await sharp(printPath).resize(badge, badge).png().toBuffer();
  await sharp(mugBlank)
    .composite([
      {
        input: placed,
        left: Math.round(w * 0.28),
        top: Math.round(h * 0.3),
      },
    ])
    .png()
    .toFile(outPath);
}

async function paperPreview(printPath, outPath) {
  const design = await sharp(printPath).resize({ width: 1400 }).png().toBuffer();
  const meta = await sharp(design).metadata();
  await sharp({
    create: {
      width: 1400 + 120,
      height: (meta.height ?? 1400) + 120,
      channels: 3,
      background: "#f9f4e8",
    },
  })
    .composite([{ input: design, left: 60, top: 60 }])
    .png()
    .toFile(outPath);
}

// 1) Tagline crest — flagship identity
const taglineSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="3600" height="3600">
  <defs><style>${fontFace()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#f9f4e8;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
    .c{font-family:Oswald,sans-serif;font-weight:500;fill:#f9f4e8;text-anchor:middle}
  </style></defs>
  <circle cx="500" cy="500" r="492" fill="#2c5f63"/>
  <circle cx="500" cy="500" r="468" fill="none" stroke="#d4a84b" stroke-width="14"/>
  <circle cx="500" cy="500" r="446" fill="none" stroke="#d97b51" stroke-width="5"/>
  <circle cx="500" cy="500" r="430" fill="none" stroke="#f9f4e8" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.4"/>
  <text class="c" x="500" y="280" font-size="34" letter-spacing="10">BROKE DADS CLUB</text>
  <line x1="320" y1="320" x2="680" y2="320" stroke="#d4a84b" stroke-width="3"/>
  <text class="a" x="500" y="460" font-size="92" letter-spacing="4">BROKE</text>
  <text class="a" x="500" y="560" font-size="58" letter-spacing="14">DOESN'T MEAN</text>
  <text class="b" x="500" y="700" font-size="118" letter-spacing="6">BROKEN</text>
  <line x1="340" y1="760" x2="660" y2="760" stroke="#d4a84b" stroke-width="3"/>
  <text class="c" x="500" y="830" font-size="28" letter-spacing="8">STILL SHOWING UP</text>
</svg>`;

// 2) Dad Tax — receipt / ledger punchline
const dadTaxSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" width="3000" height="3600">
  <defs><style>${fontFace()}
    .ink{font-family:Oswald,sans-serif;font-weight:700;fill:#1c1915;text-anchor:middle}
    .pine{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .rust{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
    .soft{font-family:Oswald,sans-serif;font-weight:500;fill:#5c5348;text-anchor:middle}
  </style></defs>
  <rect x="90" y="60" width="820" height="1080" rx="18" fill="#f9f4e8" stroke="#1c1915" stroke-width="10"/>
  <rect x="120" y="95" width="760" height="28" fill="#2c5f63"/>
  <text class="pine" x="500" y="220" font-size="42" letter-spacing="12">ITEMIZED</text>
  <text class="ink" x="500" y="360" font-size="140" letter-spacing="4">THE</text>
  <text class="rust" x="500" y="520" font-size="160" letter-spacing="2">DAD TAX</text>
  <line x1="180" y1="580" x2="820" y2="580" stroke="#1c1915" stroke-width="4" stroke-dasharray="10 8"/>
  <text class="soft" x="500" y="680" font-size="36" letter-spacing="3">KIDS MULTIPLY</text>
  <text class="soft" x="500" y="740" font-size="36" letter-spacing="3">EVERY PURCHASE</text>
  <line x1="180" y1="820" x2="820" y2="820" stroke="#1c1915" stroke-width="4"/>
  <text class="pine" x="500" y="920" font-size="48" letter-spacing="8">PAID IN FULL</text>
  <text class="soft" x="500" y="1020" font-size="28" letter-spacing="6">BROKE DADS CLUB</text>
</svg>`;

// 3) Still Showing Up — quiet dignity lockup
const stillSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 900" width="3600" height="3240">
  <defs><style>${fontFace()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#2c5f63;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
    .c{font-family:Oswald,sans-serif;font-weight:500;fill:#1c1915;text-anchor:middle}
  </style></defs>
  <text class="c" x="500" y="220" font-size="44" letter-spacing="14">BROKE DADS CLUB</text>
  <line x1="280" y1="280" x2="720" y2="280" stroke="#d4a84b" stroke-width="4"/>
  <text class="a" x="500" y="460" font-size="120" letter-spacing="10">STILL</text>
  <text class="b" x="500" y="620" font-size="120" letter-spacing="6">SHOWING UP</text>
  <line x1="280" y1="700" x2="720" y2="700" stroke="#d4a84b" stroke-width="4"/>
  <text class="c" x="500" y="800" font-size="36" letter-spacing="8">NOT A HUSTLE. A HABIT.</text>
</svg>`;

// 4) Mug crest — Black Like the Checking Account
const mugSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="3600" height="3600">
  <defs><style>${fontFace()}
    .a{font-family:Oswald,sans-serif;font-weight:600;fill:#f9f4e8;text-anchor:middle}
    .b{font-family:Oswald,sans-serif;font-weight:700;fill:#d97b51;text-anchor:middle}
    .c{font-family:Oswald,sans-serif;font-weight:500;fill:#f9f4e8;text-anchor:middle}
  </style></defs>
  <circle cx="500" cy="500" r="492" fill="#1c1915"/>
  <circle cx="500" cy="500" r="468" fill="none" stroke="#d4a84b" stroke-width="12"/>
  <circle cx="500" cy="500" r="448" fill="none" stroke="#2c5f63" stroke-width="6"/>
  <path d="M455 200 C448 180 462 168 452 150" fill="none" stroke="#f9f4e8" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
  <path d="M488 188 C484 166 498 156 490 136" fill="none" stroke="#d4a84b" stroke-width="6" stroke-linecap="round"/>
  <path d="M522 198 C530 178 516 166 526 148" fill="none" stroke="#f9f4e8" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
  <path d="M612 260 C658 260 682 290 682 324 C682 358 658 388 612 388" fill="none" stroke="#f9f4e8" stroke-width="14" stroke-linecap="round"/>
  <rect x="372" y="240" width="248" height="214" rx="22" fill="#f9f4e8"/>
  <ellipse cx="496" cy="260" rx="108" ry="22" fill="#1c1915"/>
  <ellipse cx="496" cy="256" rx="78" ry="12" fill="#2c5f63" opacity="0.7"/>
  <text class="a" x="500" y="560" font-size="52" letter-spacing="4">BLACK LIKE THE</text>
  <text class="b" x="500" y="680" font-size="72" letter-spacing="2">CHECKING</text>
  <text class="b" x="500" y="770" font-size="72" letter-spacing="2">ACCOUNT</text>
  <text class="c" x="500" y="870" font-size="26" letter-spacing="8">BROKE DADS CLUB</text>
</svg>`;

const jobs = [
  {
    dir: "01-tagline",
    name: "Broke Doesn't Mean Broken",
    svg: taglineSvg,
    kind: "tee",
    pitch:
      "Flagship brand tee. The line dads already believe. Crest format matches the castle badge language.",
  },
  {
    dir: "02-dad-tax",
    name: "The Dad Tax",
    svg: dadTaxSvg,
    kind: "tee",
    viewBoxH: 1200,
    pitch:
      "Content IP product. Turns the site's best money idea into a receipt joke partners gift without shame.",
  },
  {
    dir: "03-still-showing-up",
    name: "Still Showing Up",
    svg: stillSvg,
    kind: "tee",
    viewBoxH: 900,
    pitch:
      "Quiet dignity tee. Lower joke density, higher gift conversion for wives and adult kids.",
  },
  {
    dir: "04-checking-mug",
    name: "Black Like the Checking Account",
    svg: mugSvg,
    kind: "mug",
    pitch:
      "Daily-use gift mug. Dark crest, coffee icon, punchline that fits BDC without the skipped decaf riff.",
  },
];

const summary = [];
for (const job of jobs) {
  const outDir = join(root, job.dir);
  mkdirSync(outDir, { recursive: true });
  const printPath = join(outDir, "print.png");
  const previewPath = join(outDir, "preview.png");
  const mockPath = join(outDir, job.kind === "mug" ? "mug-mockup.png" : "tee-mockup.png");

  if (job.viewBoxH) {
    const h = Math.round((3600 * job.viewBoxH) / 1000);
    await sharp(Buffer.from(job.svg)).resize(3600, h).png().toFile(printPath);
  } else {
    await writePng(job.svg, printPath);
  }
  await paperPreview(printPath, previewPath);
  if (job.kind === "mug") {
    await mugMockup(printPath, mockPath);
  } else {
    await teeMockup(printPath, mockPath, job.dir === "02-dad-tax" ? 0.32 : 0.36);
  }
  summary.push({ ...job, printPath, mockPath, previewPath });
  console.log("ok", job.dir);
}

console.log(JSON.stringify(summary.map((j) => ({ dir: j.dir, name: j.name, kind: j.kind, pitch: j.pitch })), null, 2));
