import { join } from "node:path";
import sharp from "sharp";
import { repoRoot } from "./env.mjs";

// Pinterest prefers tall pins; 1000×1500 is a solid organic ratio.
export const PIN_W = 1000;
export const PIN_H = 1500;

const C = {
  paper: "#f7f1e6",
  panel: "#fffaf2",
  ink: "#1c1915",
  inkSoft: "#5c5348",
  pine: "#2c5f63",
  pineDeep: "#1f484b",
  rust: "#c4683f",
  gold: "#d4a84b",
  rule: "#e4d8c4",
};

const LOGO = join(repoRoot, "public/brand/club-logo.png");
const DISPLAY = "Georgia, 'Times New Roman', serif";
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

/**
 * Editorial pin: big headline, one hook line, three plain takeaways.
 * Avoids sparse bullet lists and internal jargon on the graphic.
 */
export function pinSvg({ headline, sub, bullets = [], kicker = "Free dad guide" }) {
  const headLines = wrapLines(headline, 14).slice(0, 3);
  const subLines = wrapLines(sub, 28).slice(0, 2);
  const takes = bullets.slice(0, 3);

  const headBlockH = headLines.length * 92;
  const headY = 310;
  const subY = headY + headBlockH + 36;
  const cardY = subY + subLines.length * 42 + 70;
  const cardH = 80 + takes.length * 110;

  const headSvg = headLines
    .map(
      (line, i) =>
        `<text x="72" y="${headY + i * 92}" font-family="${DISPLAY}" font-size="84" font-weight="700" fill="${C.panel}">${esc(line)}</text>`,
    )
    .join("");

  const subSvg = subLines
    .map(
      (line, i) =>
        `<text x="72" y="${subY + i * 42}" font-family="${SANS}" font-size="30" fill="#d7ecea">${esc(line)}</text>`,
    )
    .join("");

  const takeSvg = takes
    .map((b, i) => {
      const y = cardY + 70 + i * 110;
      const lines = wrapLines(b, 28);
      const text = lines
        .map(
          (line, li) =>
            `<text x="170" y="${y + li * 36}" font-family="${SANS}" font-size="30" font-weight="600" fill="${C.ink}">${esc(line)}</text>`,
        )
        .join("");
      return `
        <circle cx="118" cy="${y - 8}" r="28" fill="${C.pine}" />
        <text x="118" y="${y + 4}" text-anchor="middle" font-family="${SANS}" font-size="26" font-weight="700" fill="${C.panel}">${i + 1}</text>
        ${text}
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 ${PIN_W} ${PIN_H}">
      <defs>
        <linearGradient id="hero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${C.pine}" />
          <stop offset="100%" stop-color="${C.pineDeep}" />
        </linearGradient>
      </defs>

      <rect width="${PIN_W}" height="${PIN_H}" fill="${C.paper}" />
      <rect width="${PIN_W}" height="820" fill="url(#hero)" />
      <circle cx="920" cy="80" r="180" fill="#ffffff" opacity="0.06" />
      <circle cx="-40" cy="700" r="220" fill="#000000" opacity="0.08" />

      <image href="file://${LOGO}" x="64" y="56" width="64" height="64" />
      <text x="148" y="88" font-family="${SANS}" font-size="22" font-weight="700" fill="${C.panel}" letter-spacing="3">BROKE DADS CLUB</text>
      <text x="148" y="118" font-family="${SANS}" font-size="20" fill="#b7d4d2">${esc(kicker)}</text>

      <rect x="72" y="180" width="72" height="8" rx="4" fill="${C.gold}" />
      ${headSvg}
      ${subSvg}

      <rect x="48" y="${cardY}" width="${PIN_W - 96}" height="${cardH}" rx="28" fill="${C.panel}" />
      <rect x="48" y="${cardY}" width="12" height="${cardH}" rx="6" fill="${C.rust}" />
      ${takeSvg}

      <rect x="48" y="${PIN_H - 150}" width="${PIN_W - 96}" height="90" rx="22" fill="${C.ink}" />
      <text x="88" y="${PIN_H - 94}" font-family="${SANS}" font-size="28" font-weight="700" fill="${C.panel}">Read the free guide</text>
      <text x="${PIN_W - 88}" y="${PIN_H - 94}" text-anchor="end" font-family="${SANS}" font-size="24" fill="${C.gold}">brokedadsclub.com</text>
    </svg>
  `;
}

export async function renderPinPng(pin) {
  const svg = pinSvg(pin);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
