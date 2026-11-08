#!/usr/bin/env node
/**
 * Lists live guides with fewer than min inbound internal links from other guides,
 * topic hubs, homepage start-here, or printables/newsletters.
 *
 * Usage: node scripts/list-orphan-guides.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const guidesDir = path.join(root, "content/guides");
const minInbound = 2;

function readGuides() {
  return fs
    .readdirSync(guidesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(guidesDir, file), "utf8");
      const slugMatch = raw.match(/^slug:\s*['"]?([a-z0-9-]+)/m);
      const statusMatch = raw.match(/^status:\s*['"]?(\w+)/m);
      const categoryMatch = raw.match(/^category:\s*['"]?(\w+)/m);
      const relatedBlock = raw.match(/^related:\n((?:  - .+\n)+)/m);
      const related = relatedBlock
        ? relatedBlock[1]
            .split("\n")
            .map((line) => line.replace(/^\s*-\s*/, "").trim())
            .filter(Boolean)
        : [];
      return {
        file,
        slug: slugMatch?.[1] ?? file.replace(/\.md$/, ""),
        status: statusMatch?.[1] ?? "published",
        category: categoryMatch?.[1] ?? "",
        related,
        raw,
      };
    })
    .filter((guide) => guide.status === "published" || guide.status === "scheduled");
}

function collectCorpus() {
  const chunks = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|tsx|ts|mjs)$/.test(entry.name)) {
        chunks.push(fs.readFileSync(full, "utf8"));
      }
    }
  };
  walk(path.join(root, "content"));
  walk(path.join(root, "src"));
  return chunks.join("\n");
}

const guides = readGuides();
const corpus = collectCorpus();
const inbound = new Map(guides.map((guide) => [guide.slug, []]));

for (const guide of guides) {
  for (const target of guide.related) {
    if (!inbound.has(target) || target === guide.slug) continue;
    inbound.get(target).push(`related:${guide.slug}`);
  }
  const bodyLinks = [...guide.raw.matchAll(/\]\(\/guides\/([a-z0-9-]+)\)/g)].map(
    (match) => match[1],
  );
  for (const target of bodyLinks) {
    if (!inbound.has(target) || target === guide.slug) continue;
    inbound.get(target).push(`body:${guide.slug}`);
  }
}

// Topic hubs and homepage always count as discovery paths once those pages are indexed.
for (const guide of guides) {
  const hubMentions = (corpus.match(new RegExp(`/guides/${guide.slug}`, "g")) || [])
    .length;
  if (hubMentions > 0) {
    inbound.get(guide.slug)?.push(`site-mentions:${hubMentions}`);
  }
}

const orphans = guides
  .map((guide) => {
    const refs = inbound.get(guide.slug) ?? [];
    const uniqueSources = new Set(
      refs
        .filter((ref) => ref.startsWith("related:") || ref.startsWith("body:"))
        .map((ref) => ref.split(":")[1]),
    );
    return { ...guide, uniqueSources: [...uniqueSources], refs };
  })
  .filter((guide) => guide.uniqueSources.length < minInbound)
  .sort((a, b) => a.uniqueSources.length - b.uniqueSources.length);

console.log(
  `Guides with fewer than ${minInbound} inbound links from other guides (body/related):\n`,
);
for (const guide of orphans) {
  console.log(
    `- ${guide.slug} (${guide.category}) inbound=${guide.uniqueSources.length} [${guide.uniqueSources.join(", ") || "none"}]`,
  );
}
console.log(`\n${orphans.length} of ${guides.length} guides need more internal links.`);
