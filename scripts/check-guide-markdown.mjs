#!/usr/bin/env node
/**
 * Fails if guide bodies still contain raw markdown link syntax after stripping
 * valid [label](url) links. Catches broken tables / unparsed lines that would
 * show "](/guides/..." as literal text on the page.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidesDir = path.join(root, "content/guides");

const files = fs.readdirSync(guidesDir).filter((name) => name.endsWith(".md"));
const failures = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(guidesDir, file), "utf8");
  const { content } = matter(raw);
  const withoutCode = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]+`/g, "");
  // Remove valid markdown links; anything left with ](/guides is a leak.
  const stripped = withoutCode.replace(
    /\[[^\]]*\]\((\/(?:guides|resources)(?:\/[^)\s]*)?|https?:\/\/[^)\s]+)\)/g,
    "",
  );
  if (/\]\(\/(guides|resources)\b/.test(stripped)) {
    failures.push(file);
  }
}

if (failures.length) {
  console.error(
    "Raw markdown link text found in guide bodies:\n" +
      failures.map((file) => `  - ${file}`).join("\n"),
  );
  process.exit(1);
}

console.log(`check-guide-markdown: ok (${files.length} guides)`);
