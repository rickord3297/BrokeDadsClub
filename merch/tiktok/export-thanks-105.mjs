#!/usr/bin/env node
/**
 * TikTok thank-you frames (9:16) in the cream BDC hook style.
 * Run: node merch/tiktok/export-thanks-105.mjs
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(dir, "output");
const OSWALD_PATH = join(dir, "../pinterest/fonts/Oswald-Bold.ttf");
const oswald = opentype.parse(readFileSync(OSWALD_PATH).buffer);

const W = 1080;
const H = 1920;
const C = {
  paper: "#f4efe6",
  ink: "#14110f",
  pine: "#2c5f63",
  gold: "#c4a35a",
};
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hookPaths(lines, fontSize) {
  const lineHeight = Math.round(fontSize * 1.08);
  const blockH = lines.length * lineHeight;
  const startY = Math.round(H / 2 - blockH / 2 + fontSize * 0.78);
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
        if (d) parts.push(`<path d="${d}" fill="${C.ink}" />`);
        x += adv;
      }
      return parts.join("\n");
    })
    .join("\n");
}

function frameSvg({ lines, footer, fontSize = 92 }) {
  const grain = Array.from({ length: 160 }, (_, i) => {
    const x = (i * 97) % W;
    const y = (i * 53) % H;
    const o = 0.025 + (i % 4) * 0.008;
    return `<circle cx="${x}" cy="${y}" r="1.2" fill="${C.ink}" opacity="${o}" />`;
  }).join("");

  const size = lines.length <= 2 ? fontSize : fontSize - 12;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${C.paper}" />
      ${grain}
      <text x="${W / 2}" y="260" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="700" fill="${C.pine}" letter-spacing="7">BROKE DADS CLUB</text>
      <rect x="${W / 2 - 48}" y="284" width="96" height="2.5" fill="${C.gold}" />
      ${hookPaths(lines, size)}
      <text x="${W / 2}" y="1640" text-anchor="middle" font-family="${SANS}" font-size="28" fill="${C.ink}">
        <tspan font-weight="700">${esc(footer.split("·")[0].trim())}</tspan>${
          footer.includes("·")
            ? `<tspan> · ${esc(footer.split("·").slice(1).join("·").trim())}</tspan>`
            : ""
        }
      </text>
    </svg>
  `;
}

const frames = [
  {
    id: "01-105-dads",
    lines: ["105 dads", "in the club"],
    footer: "thank you · for real",
  },
  {
    id: "02-broke-not-broken",
    lines: ["Broke doesn't", "mean broken"],
    footer: "105 strong · and counting",
  },
  {
    id: "03-doing-the-math",
    lines: ["Follow if you're", "doing the math", "too"],
    footer: "more grocery math coming",
    fontSize: 84,
  },
];

mkdirSync(OUT, { recursive: true });

for (const frame of frames) {
  const svg = frameSvg(frame);
  const file = join(OUT, `${frame.id}.png`);
  await sharp(Buffer.from(svg)).png().toFile(file);
  console.log("wrote", file);
}

console.log(`\n${frames.length} TikTok frames in ${OUT}`);
