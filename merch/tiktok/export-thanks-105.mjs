#!/usr/bin/env node
/**
 * Thank-you TikTok set matched to existing NFL article snapshots
 * (720x1280 cream series in merch/tiktok/reference/).
 *
 * Run: node merch/tiktok/export-thanks-105.mjs
 */

import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(dir, "output");
const REF = join(dir, "reference/tiktok-nfl-01-hook.png");
const OSWALD_PATH = join(dir, "../pinterest/fonts/Oswald-Bold.ttf");
const oswald = opentype.parse(readFileSync(OSWALD_PATH).buffer);

const W = 720;
const H = 1280;

const C = {
  paper: "#f7f3e8",
  ink: "#1a1612",
  pine: "#2a4f52",
  gold: "#c4a35a",
  soft: "#5c5348",
};

const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function grain() {
  return Array.from({ length: 280 }, (_, i) => {
    const x = (i * 97 + 13) % W;
    const y = (i * 53 + 7) % H;
    const o = 0.04 + (i % 5) * 0.012;
    return `<circle cx="${x}" cy="${y}" r="1.15" fill="${C.ink}" opacity="${o}" />`;
  }).join("");
}

function oswaldBlock(lines, fontSize, centerY, fill = C.ink) {
  const lineHeight = Math.round(fontSize * 1.1);
  const blockH = lines.length * lineHeight;
  const startY = Math.round(centerY - blockH / 2 + fontSize * 0.78);
  return lines
    .map((line, i) => {
      const glyphs = [];
      let total = 0;
      for (const ch of line) {
        const glyph = oswald.charToGlyph(ch);
        const adv = glyph.advanceWidth * (fontSize / oswald.unitsPerEm);
        glyphs.push({ glyph, adv });
        total += adv;
      }
      let x = W / 2 - total / 2;
      const baseline = startY + i * lineHeight;
      const parts = [];
      for (const { glyph, adv } of glyphs) {
        const path = glyph.getPath(x, baseline, fontSize);
        const d = path.toPathData(2);
        if (d) parts.push(`<path d="${d}" fill="${fill}" />`);
        x += adv;
      }
      return parts.join("\n");
    })
    .join("\n");
}

/** Match snapshot paper color; grain handles the texture. */
async function paperTexture() {
  return sharp({
    create: { width: W, height: H, channels: 3, background: C.paper },
  })
    .png()
    .toBuffer();
}

function slideHook() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${grain()}
      <text x="${W / 2}" y="168" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" fill="${C.pine}" letter-spacing="5">BROKE DADS CLUB</text>
      <rect x="${W / 2 - 42}" y="186" width="84" height="2" fill="${C.gold}" />
      ${oswaldBlock(["105 dads", "in the club"], 72, H * 0.48)}
      <text x="${W / 2}" y="1080" text-anchor="middle" font-family="${SANS}" font-size="22" fill="${C.ink}">
        <tspan font-weight="700">swipe</tspan><tspan> - thank you for real</tspan>
      </text>
    </svg>
  `;
}

function slideNumber() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${grain()}
      <text x="${W / 2}" y="420" text-anchor="middle" font-family="${SERIF}" font-size="140" font-weight="700" fill="${C.pine}">105</text>
      <line x1="180" y1="480" x2="${W / 2 - 14}" y2="480" stroke="${C.gold}" stroke-width="2" />
      <polygon points="${W / 2},472 ${W / 2 + 8},480 ${W / 2},488 ${W / 2 - 8},480" fill="${C.gold}" />
      <line x1="${W / 2 + 14}" y1="480" x2="540" y2="480" stroke="${C.gold}" stroke-width="2" />
      <text x="${W / 2}" y="560" text-anchor="middle" font-family="${SERIF}" font-size="34" fill="${C.pine}">dads in the club</text>
      <text x="${W / 2}" y="720" text-anchor="middle" font-family="${SERIF}" font-size="26" fill="${C.soft}">Not viral.</text>
      <text x="${W / 2}" y="760" text-anchor="middle" font-family="${SERIF}" font-size="26" fill="${C.soft}">Just enough people who get it.</text>
    </svg>
  `;
}

function slideStack() {
  const items = [
    "Grocery week math",
    "Dad tax without the shame",
    "Gas station dinner nights",
  ];
  const list = items
    .map((item, i) => {
      const y = 520 + i * 100;
      return `
        <text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${SERIF}" font-size="30" fill="${C.ink}">
          <tspan font-weight="700">${i + 1}.</tspan>
          <tspan> ${esc(item)}</tspan>
        </text>
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${grain()}
      <text x="${W / 2}" y="360" text-anchor="middle" font-family="${SERIF}" font-size="40" font-weight="700" fill="${C.ink}">What you get here</text>
      ${list}
    </svg>
  `;
}

function slideCta() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${grain()}
      <line x1="80" y1="160" x2="${W / 2 - 130}" y2="160" stroke="${C.soft}" stroke-width="1.5" opacity="0.55" />
      <text x="${W / 2}" y="168" text-anchor="middle" font-family="${SANS}" font-size="18" font-weight="700" fill="${C.pine}" letter-spacing="4">BROKE DADS CLUB</text>
      <line x1="${W / 2 + 130}" y1="160" x2="640" y2="160" stroke="${C.soft}" stroke-width="1.5" opacity="0.55" />

      ${oswaldBlock(["Thanks for", "being here."], 64, 520)}

      <line x1="220" y1="700" x2="${W / 2 - 10}" y2="700" stroke="${C.soft}" stroke-width="1.5" opacity="0.5" />
      <circle cx="${W / 2}" cy="700" r="4" fill="${C.soft}" opacity="0.7" />
      <line x1="${W / 2 + 10}" y1="700" x2="500" y2="700" stroke="${C.soft}" stroke-width="1.5" opacity="0.5" />

      <text x="${W / 2}" y="820" text-anchor="middle" font-family="${SANS}" font-size="26" fill="${C.ink}">More dad budget guides</text>
      <text x="${W / 2}" y="900" text-anchor="middle" font-family="${SANS}" font-size="42" font-weight="700" fill="${C.ink}">link in bio</text>
      <text x="${W / 2}" y="960" text-anchor="middle" font-family="${SANS}" font-size="22" fill="${C.soft}">brokedadsclub.com</text>
    </svg>
  `;
}

async function writePng(name, svg) {
  const file = join(OUT, name);
  const paper = await paperTexture();
  const textLayer = await sharp(Buffer.from(svg))
    .ensureAlpha()
    .png()
    .toBuffer();

  const base =
    paper ??
    (await sharp({
      create: { width: W, height: H, channels: 3, background: C.paper },
    })
      .png()
      .toBuffer());

  await sharp(base)
    .composite([{ input: textLayer, blend: "over" }])
    .png()
    .toFile(file);
  console.log("wrote", file);
}

mkdirSync(OUT, { recursive: true });

await writePng("01-hook-105-dads.png", slideHook());
await writePng("02-number-105.png", slideNumber());
await writePng("03-stack-what-you-get.png", slideStack());
await writePng("04-cta-thanks.png", slideCta());

console.log(`\n4 slides @ 720x1280 matched to your NFL snapshot series → ${OUT}`);
