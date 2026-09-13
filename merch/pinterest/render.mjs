import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { repoRoot } from "./env.mjs";

// Pinterest prefers tall pins; 1000×1500 is a solid organic ratio.
export const PIN_W = 1000;
export const PIN_H = 1500;

const C = {
  paper: "#f9f4e8",
  paper2: "#f0e6d4",
  ink: "#1c1915",
  inkSoft: "#5c5348",
  pine: "#2c5f63",
  rust: "#d97b51",
  gold: "#d4a84b",
  rule: "#e0d3bc",
  white: "#ffffff",
};

const LOGO = join(repoRoot, "public/brand/club-logo.png");

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

export function pinSvg({ headline, sub, bullets = [] }) {
  const headLines = wrapLines(headline, 18);
  const headStart = 320;
  const headSvg = headLines
    .map(
      (line, i) =>
        `<text x="80" y="${headStart + i * 78}" font-family="Helvetica, Arial, sans-serif" font-size="68" font-weight="800" fill="${C.ink}">${esc(line)}</text>`,
    )
    .join("");

  const bulletStart = headStart + headLines.length * 78 + 80;
  const bulletSvg = bullets
    .slice(0, 4)
    .map((b, i) => {
      const y = bulletStart + i * 90;
      return `
        <circle cx="100" cy="${y - 10}" r="10" fill="${C.rust}" />
        <text x="130" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="${C.inkSoft}">${esc(b)}</text>
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 ${PIN_W} ${PIN_H}">
      <rect width="${PIN_W}" height="${PIN_H}" fill="${C.paper}" />
      <circle cx="900" cy="120" r="220" fill="${C.pine}" opacity="0.08" />
      <circle cx="80" cy="1280" r="260" fill="${C.rust}" opacity="0.08" />

      <rect x="0" y="0" width="${PIN_W}" height="140" fill="${C.pine}" />
      <image href="file://${LOGO}" x="40" y="28" width="84" height="84" />
      <text x="140" y="88" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="${C.paper}" letter-spacing="2">BROKE DADS CLUB</text>

      <rect x="80" y="200" width="160" height="10" rx="5" fill="${C.gold}" />
      ${headSvg}
      <text x="80" y="${headStart + headLines.length * 78 + 20}" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="${C.pine}">${esc(sub)}</text>

      <rect x="80" y="${bulletStart - 50}" width="${PIN_W - 160}" height="2" fill="${C.rule}" />
      ${bulletSvg}

      <rect x="0" y="${PIN_H - 110}" width="${PIN_W}" height="110" fill="${C.paper2}" />
      <text x="80" y="${PIN_H - 48}" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${C.inkSoft}">brokedadsclub.com</text>
      <text x="${PIN_W - 80}" y="${PIN_H - 48}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="${C.rust}">Free guide</text>
    </svg>
  `;
}

export async function renderPinPng(pin) {
  const svg = pinSvg(pin);
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function logoExists() {
  try {
    readFileSync(LOGO);
    return true;
  } catch {
    return false;
  }
}
