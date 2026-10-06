import { readFileSync } from "node:fs";
import { join } from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";
import { dir } from "./env.mjs";

// Tall pin. Modeled on BDC TikTok hooks: cream, brand, gold rule, big condensed line.
export const PIN_W = 1000;
export const PIN_H = 1500;

const C = {
  paper: "#f4efe6",
  ink: "#14110f",
  pine: "#2c5f63",
  gold: "#c4a35a",
};

const OSWALD_PATH = join(dir, "fonts/Oswald-Bold.ttf");
const oswald = opentype.parse(readFileSync(OSWALD_PATH).buffer);
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLines(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function splitFooter(footer) {
  const parts = String(footer).split(/\s+[·\-]\s+/);
  if (parts.length >= 2) {
    return { lead: parts[0].trim(), rest: parts.slice(1).join(" · ").trim() };
  }
  return { lead: footer, rest: "" };
}

function hookPath(line, fontSize, centerX, baselineY) {
  const glyphs = [];
  let total = 0;
  for (const ch of line) {
    const glyph = oswald.charToGlyph(ch);
    const adv = glyph.advanceWidth * (fontSize / oswald.unitsPerEm);
    glyphs.push({ glyph, adv });
    total += adv;
  }
  let x = centerX - total / 2;
  const parts = [];
  for (const { glyph, adv } of glyphs) {
    const path = glyph.getPath(x, baselineY, fontSize);
    const d = path.toPathData(2);
    if (d) parts.push(`<path d="${d}" fill="${C.ink}" />`);
    x += adv;
  }
  return parts.join("\n");
}

/**
 * Minimal hook card matching the TikTok cream / condensed style.
 * Hook text is drawn as Oswald paths so the condensed face always renders.
 */
export function pinSvg({ headline, lines, footer = "free guide" }) {
  const hookLines = (lines?.length ? lines : wrapLines(headline, 18)).slice(0, 4);
  const lineCount = hookLines.length;
  const fontSize = lineCount <= 2 ? 86 : lineCount === 3 ? 74 : 64;
  const lineHeight = Math.round(fontSize * 1.08);
  const blockH = lineCount * lineHeight;
  const startY = Math.round(PIN_H / 2 - blockH / 2 + fontSize * 0.78);

  const hookSvg = hookLines
    .map((line, i) => hookPath(line, fontSize, PIN_W / 2, startY + i * lineHeight))
    .join("\n");

  const { lead, rest } = splitFooter(footer);
  const footerSvg = rest
    ? `<text x="${PIN_W / 2}" y="1280" text-anchor="middle" font-family="${SANS}" font-size="26" fill="${C.ink}"><tspan font-weight="700">${esc(lead)}</tspan><tspan> · ${esc(rest)}</tspan></text>`
    : `<text x="${PIN_W / 2}" y="1280" text-anchor="middle" font-family="${SANS}" font-size="26" font-weight="700" fill="${C.ink}">${esc(lead)}</text>`;

  const grain = Array.from({ length: 140 }, (_, i) => {
    const x = (i * 97) % PIN_W;
    const y = (i * 53) % PIN_H;
    const o = 0.025 + (i % 4) * 0.008;
    return `<circle cx="${x}" cy="${y}" r="1.1" fill="${C.ink}" opacity="${o}" />`;
  }).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 ${PIN_W} ${PIN_H}">
      <rect width="${PIN_W}" height="${PIN_H}" fill="${C.paper}" />
      ${grain}

      <text x="${PIN_W / 2}" y="210" text-anchor="middle" font-family="${SANS}" font-size="28" font-weight="700" fill="${C.pine}" letter-spacing="7">BROKE DADS CLUB</text>
      <rect x="${PIN_W / 2 - 48}" y="234" width="96" height="2.5" fill="${C.gold}" />

      ${hookSvg}
      ${footerSvg}
    </svg>
  `;
}

export async function renderPinPng(pin) {
  return sharp(Buffer.from(pinSvg(pin))).png().toBuffer();
}
