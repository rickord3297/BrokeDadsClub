import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = dirname(fileURLToPath(import.meta.url));
const font = readFileSync(join(dir, "Oswald.ttf")).toString("base64");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="3600" height="3600">
  <defs>
    <style>
      @font-face {
        font-family: "Oswald";
        src: url("data:font/ttf;base64,${font}") format("truetype");
        font-weight: 100 900;
        font-style: normal;
      }
      .stamp { font-family: Oswald, sans-serif; font-weight: 600; fill: #f9f4e8; text-anchor: middle; }
      .punch { font-family: Oswald, sans-serif; font-weight: 700; fill: #d97b51; text-anchor: middle; }
      .club { font-family: Oswald, sans-serif; font-weight: 500; fill: #f9f4e8; text-anchor: middle; }
    </style>
  </defs>

  <circle cx="500" cy="500" r="492" fill="#2c5f63"/>
  <circle cx="500" cy="500" r="468" fill="none" stroke="#d4a84b" stroke-width="14"/>
  <circle cx="500" cy="500" r="446" fill="none" stroke="#d97b51" stroke-width="5"/>
  <circle cx="500" cy="500" r="430" fill="none" stroke="#f9f4e8" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.45"/>

  <!-- steam -->
  <path d="M455 188 C448 168 462 156 452 138" fill="none" stroke="#f9f4e8" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
  <path d="M488 176 C484 154 498 144 490 124" fill="none" stroke="#d4a84b" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
  <path d="M522 186 C530 166 516 154 526 136" fill="none" stroke="#f9f4e8" stroke-width="6" stroke-linecap="round" opacity="0.85"/>

  <!-- mug -->
  <path d="M612 248 C658 248 682 278 682 312 C682 346 658 376 612 376" fill="none" stroke="#f9f4e8" stroke-width="16" stroke-linecap="round"/>
  <rect x="372" y="228" width="248" height="214" rx="22" fill="#f9f4e8"/>
  <ellipse cx="496" cy="248" rx="108" ry="22" fill="#1c1915"/>
  <ellipse cx="496" cy="244" rx="78" ry="12" fill="#2c5f63" opacity="0.55"/>
  <path d="M392 268 H604" stroke="#d97b51" stroke-width="3" opacity="0.55"/>

  <text class="stamp" x="500" y="518" font-size="54" letter-spacing="4">BROKE DOESN'T</text>
  <text class="stamp" x="500" y="578" font-size="54" letter-spacing="10">MEAN</text>
  <text class="punch" x="500" y="708" font-size="132" letter-spacing="6">DECAF</text>
  <line x1="340" y1="748" x2="660" y2="748" stroke="#d4a84b" stroke-width="3"/>
  <text class="club" x="500" y="812" font-size="28" letter-spacing="9">BROKE DADS CLUB</text>
</svg>
`;

writeFileSync(join(dir, "print.svg"), svg);

const printPng = join(dir, "print.png");
await sharp(Buffer.from(svg)).png().toFile(printPng);

const mugPath =
  process.argv[2] ??
  "/Users/rickygreen/.cursor/projects/Users-rickygreen-BrokeDadsClub/assets/mug-blank-photo.png";

const mug = sharp(mugPath);
const meta = await mug.metadata();
const width = meta.width ?? 1024;
const height = meta.height ?? 1024;

const badgeSize = Math.round(width * 0.34);
const badge = await sharp(printPng)
  .resize(badgeSize, badgeSize)
  .png()
  .toBuffer();

const left = Math.round(width * 0.27);
const top = Math.round(height * 0.33);

await sharp(mugPath)
  .composite([{ input: badge, left, top, blend: "over" }])
  .png()
  .toFile(join(dir, "mug-mockup.png"));

console.log(
  JSON.stringify({ width, height, badgeSize, left, top, printPng }, null, 2),
);
