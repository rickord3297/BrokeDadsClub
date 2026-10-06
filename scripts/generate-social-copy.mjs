#!/usr/bin/env node
/**
 * Turns guides into social drafts: a 5-slide carousel outline, a short-form
 * video hook, and a link-free Reddit post per guide.
 *
 * Usage:
 *   node scripts/generate-social-copy.mjs                 # writes social-drafts.json
 *   node scripts/generate-social-copy.mjs --print         # also logs drafts to the console
 *   node scripts/generate-social-copy.mjs --slug the-dad-tax --print
 *   node scripts/generate-social-copy.mjs --all           # include drafts and scheduled guides
 *   node scripts/generate-social-copy.mjs --out tmp/social.json
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import matter from "gray-matter";

const ROOT = resolve(import.meta.dirname, "..");
const GUIDES_DIR = join(ROOT, "content/guides");
const SITE_URL = "https://brokedadsclub.com";

const BOILERPLATE_HEADINGS = new Set([
  "the point",
  "when this breaks",
  "keep going",
  "faq",
  "frequently asked questions",
  "related guides",
  "sources",
]);

const SUBREDDITS = {
  Money: ["r/daddit", "r/Frugal", "r/personalfinance"],
  Kids: ["r/daddit", "r/Parenting"],
  Time: ["r/daddit", "r/Parenting", "r/productivity"],
  Gear: ["r/daddit", "r/BuyItForLife"],
  Work: ["r/daddit", "r/workingdads"],
};

function parseArgs(argv) {
  const args = { all: false, print: false, slug: null, out: join(ROOT, "social-drafts.json") };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--print") args.print = true;
    else if (arg === "--slug") args.slug = argv[++i];
    else if (arg === "--out") args.out = resolve(argv[++i]);
  }
  return args;
}

/** Plain text with markdown syntax, links, and long dashes removed. */
function toPlain(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/\s*[\u2013\u2014]\s*/g, ", ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text) {
  const match = text.match(/^(.+?[.!?])(?=\s+[A-Z"']|$)/);
  return (match ? match[1] : text).trim();
}

/** Opening sentences, extended past one-word openers like "Yes." */
function leadSentences(text, minLength = 60) {
  let summary = firstSentence(text);
  let rest = text.slice(summary.length).trim();
  while (summary.length < minLength && rest) {
    const next = firstSentence(rest);
    summary = `${summary} ${next}`;
    rest = rest.slice(next.length).trim();
  }
  return summary;
}

function withPeriod(text) {
  return /[.!?:]$/.test(text) ? text : `${text}.`;
}

function capitalize(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

function clamp(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function paragraphs(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim().split(/\n(?=\s*(?:[-*+]|\d+\.)\s)/)[0].trim())
    .filter((block) => block && !/^(#|[-*+]\s|\d+\.\s|>|\||```)/.test(block))
    .filter((block) => !/:$/.test(block) || block.length > 40);
}

/** H2 sections in order, each with its first paragraph's opening sentence. */
function extractSections(body) {
  const parts = body.split(/^## +/m).slice(1);
  return parts.map((part) => {
    const [headingLine, ...rest] = part.split("\n");
    const heading = toPlain(headingLine);
    const content = rest.join("\n");
    const bullets = extractBullets(content);
    const lead = paragraphs(content).map(toPlain).find((p) => p.length >= 25 && !p.endsWith(":"));
    const firstBullet = bullets[0]
      ? [bullets[0].label && withPeriod(bullets[0].label), bullets[0].text].filter(Boolean).join(" ")
      : "";
    const quote = content.match(/^>\s?(.+)$/m)?.[1];
    const summary = lead ? leadSentences(lead) : firstBullet || (quote ? toPlain(quote) : "");
    return { heading, summary, bullets };
  });
}

/** Top-level list items, splitting a leading bold label from the rest. */
function extractBullets(markdown) {
  const items = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^[-*+]\s+(.+)$/) ?? line.match(/^\d+\.\s+(.+)$/);
    if (!match) continue;
    const raw = match[1];
    const labeled = raw.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
    const label = labeled ? toPlain(labeled[1]).replace(/:$/, "") : null;
    const text = toPlain(labeled ? labeled[2] : raw);
    items.push({ label, text: leadSentences(text, 40) || text });
  }
  return items;
}

/**
 * The three strongest takeaways: content H2 sections first, falling back to
 * bullets when a guide has fewer than three real sections.
 */
function pickKeyPoints(sections, bullets) {
  const content = sections.filter((s) => !BOILERPLATE_HEADINGS.has(s.heading.toLowerCase()));
  if (content.length >= 3) {
    return {
      source: "h2",
      points: content.slice(0, 3).map((s) => ({ headline: s.heading, detail: s.summary })),
    };
  }
  const fromBullets = bullets.slice(0, 3).map((b) => ({
    headline: b.label ?? clamp(b.text, 60),
    detail: b.label ? b.text : "",
  }));
  const fromSections = content.map((s) => ({ headline: s.heading, detail: s.summary }));
  return { source: "bullets", points: [...fromSections, ...fromBullets].slice(0, 3) };
}

function guideUrl(slug, source) {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: "social",
    utm_campaign: slug,
  });
  return `${SITE_URL}/guides/${slug}?${params}`;
}

function buildCarousel(guide, points, closer) {
  return [
    { slide: 1, role: "hook", headline: guide.title, body: firstSentence(guide.excerpt) },
    ...points.map((point, i) => ({
      slide: i + 2,
      role: "point",
      headline: point.headline,
      body: clamp(point.detail, 140),
    })),
    {
      slide: 5,
      role: "cta",
      headline: closer ? clamp(closer, 90) : "Save this for the next ask.",
      body: "Full guide and free tools: link in bio. Broke Dads Club.",
    },
  ];
}

function buildVideo(guide, points, closer) {
  return {
    hook: guide.title.endsWith("?") ? guide.title : leadSentences(guide.excerpt, 30),
    onScreenText: clamp(guide.title, 60),
    talkingPoints: points.map((point) =>
      point.detail ? `${point.headline}: ${clamp(point.detail, 120)}` : point.headline,
    ),
    outro: closer ? clamp(closer, 120) : "Full breakdown is free. Link in bio.",
    targetLength: "20-35s",
  };
}

function buildReddit(guide, lede, points, closer) {
  const lines = [
    lede,
    "",
    "The short version:",
    "",
    ...points.map((point) =>
      point.detail ? `- **${withPeriod(point.headline)}** ${point.detail}` : `- ${point.headline}`,
    ),
  ];
  if (closer) lines.push("", closer);
  lines.push(
    "",
    "Curious what's worked for other dads here.",
    "",
    "---",
    "",
    "^(I wrote up a longer version with the full checklist. Not linking it here; happy to drop it in the comments if anyone wants it and the mods are OK with it.)",
  );
  const afterColon = guide.title.split(": ")[1];
  return {
    title: clamp(capitalize(afterColon ?? guide.title).replace(/[.!]$/, ""), 300),
    body: lines.join("\n"),
    suggestedSubreddits: SUBREDDITS[guide.category] ?? ["r/daddit"],
    firstCommentIfAsked: `Here's the longer write-up: ${guideUrl(guide.slug, "reddit")}`,
  };
}

async function loadGuides({ all, slug }) {
  const files = (await readdir(GUIDES_DIR)).filter((f) => [".md", ".mdx"].includes(extname(f)));
  const guides = [];
  for (const file of files.sort()) {
    const { data, content } = matter(await readFile(join(GUIDES_DIR, file), "utf8"));
    const guideSlug = data.slug ?? file.replace(/\.mdx?$/, "");
    if (slug && guideSlug !== slug) continue;
    if (!all && (data.status ?? "published") !== "published") continue;
    guides.push({
      file,
      slug: guideSlug,
      title: toPlain(String(data.title ?? guideSlug)),
      excerpt: toPlain(String(data.excerpt ?? data.description ?? "")),
      category: data.category ?? "Money",
      status: data.status ?? "published",
      body: content,
    });
  }
  return guides;
}

function draftFor(guide) {
  const sections = extractSections(guide.body);
  const bullets = extractBullets(guide.body.split(/^## +/m).slice(1).join("\n"));
  const { source, points } = pickKeyPoints(sections, bullets);
  const ledeBlock = paragraphs(guide.body.split(/^## +/m)[0])[0];
  const lede = ledeBlock ? toPlain(ledeBlock) : guide.excerpt;
  const pointSection = sections.find((s) => s.heading.toLowerCase() === "the point");
  const closer = pointSection?.summary ?? "";

  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    category: guide.category,
    status: guide.status,
    keyPointSource: source,
    keyPoints: points,
    carousel: buildCarousel(guide, points, closer),
    video: buildVideo(guide, points, closer),
    reddit: buildReddit(guide, lede, points, closer),
    links: {
      instagram: guideUrl(guide.slug, "instagram"),
      pinterest: guideUrl(guide.slug, "pinterest"),
      tiktok: guideUrl(guide.slug, "tiktok"),
    },
  };
}

function printDraft(draft) {
  const rule = "─".repeat(72);
  console.log(`\n${rule}\n${draft.title}  [${draft.category}]  /guides/${draft.slug}\n${rule}`);
  console.log("\nCAROUSEL");
  for (const slide of draft.carousel) {
    console.log(`  ${slide.slide}. ${slide.headline}`);
    if (slide.body) console.log(`     ${slide.body}`);
  }
  console.log("\nVIDEO");
  console.log(`  Hook: ${draft.video.hook}`);
  draft.video.talkingPoints.forEach((point, i) => console.log(`  ${i + 1}) ${point}`));
  console.log(`  Outro: ${draft.video.outro}`);
  console.log(`\nREDDIT  (${draft.reddit.suggestedSubreddits.join(", ")})`);
  console.log(`  Title: ${draft.reddit.title}\n`);
  console.log(draft.reddit.body.replace(/^/gm, "  "));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const guides = await loadGuides(args);
  if (guides.length === 0) {
    console.error(args.slug ? `No guide found for slug "${args.slug}".` : "No guides found.");
    process.exit(1);
  }

  const drafts = guides.map(draftFor);
  await mkdir(dirname(args.out), { recursive: true });
  await writeFile(
    args.out,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), count: drafts.length, drafts }, null, 2)}\n`,
  );

  if (args.print) drafts.forEach(printDraft);
  const thin = drafts.filter((d) => d.keyPoints.length < 3).map((d) => d.slug);
  console.log(`\nWrote ${drafts.length} drafts to ${args.out}`);
  if (thin.length) console.log(`Fewer than 3 key points: ${thin.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
