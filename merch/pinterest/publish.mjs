#!/usr/bin/env node
/**
 * Publish catalog pins to Pinterest.
 *
 * Usage:
 *   node merch/pinterest/publish.mjs --dry-run
 *   node merch/pinterest/publish.mjs --limit=1
 *   node merch/pinterest/publish.mjs
 *   node merch/pinterest/publish.mjs --id=the-dad-tax
 *
 * Requires:
 *   - node merch/pinterest/auth.mjs (once)
 *   - PINTEREST_BOARD_ID in .env.local
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createPin } from "./api.mjs";
import { pins } from "./catalog.mjs";
import {
  loadEnv,
  requireConfig,
  publishedPath,
  outputDir,
} from "./env.mjs";
import { renderPinPng } from "./render.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const limitArg = args.find((a) => a.startsWith("--limit="));
const idArg = args.find((a) => a.startsWith("--id="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const onlyId = idArg ? idArg.split("=")[1] : null;

const env = loadEnv();
const { boardId } = requireConfig(env);

if (!boardId && !dryRun) {
  throw new Error(
    "Set PINTEREST_BOARD_ID in .env.local (run list-boards.mjs first)",
  );
}

function readPublished() {
  if (!existsSync(publishedPath)) return {};
  return JSON.parse(readFileSync(publishedPath, "utf8"));
}

function writePublished(map) {
  writeFileSync(publishedPath, `${JSON.stringify(map, null, 2)}\n`);
}

mkdirSync(outputDir, { recursive: true });
const published = readPublished();
let selected = pins.filter((p) => (onlyId ? p.id === onlyId : true));
if (!force) {
  selected = selected.filter((p) => !published[p.id]);
}
selected = selected.slice(0, Number.isFinite(limit) ? limit : selected.length);

if (!selected.length) {
  console.log("Nothing to publish. All catalog pins already recorded, or filter matched none.");
  console.log("Use --force to republish, or add pins to catalog.mjs");
  process.exit(0);
}

console.log(
  dryRun
    ? `Dry run: ${selected.length} pin(s)`
    : `Publishing ${selected.length} pin(s) to board ${boardId}`,
);

for (const pin of selected) {
  const png = await renderPinPng(pin);
  const localPath = join(outputDir, `${pin.id}.png`);
  writeFileSync(localPath, png);
  const payload = {
    board_id: boardId || "DRY_RUN",
    title: pin.title.slice(0, 100),
    description: pin.description.slice(0, 800),
    alt_text: (pin.alt || pin.title).slice(0, 500),
    link: pin.link,
    media_source: {
      source_type: "image_base64",
      content_type: "image/png",
      data: png.toString("base64"),
    },
  };

  if (dryRun) {
    console.log(`\n[dry-run] ${pin.id}`);
    console.log(`  title: ${payload.title}`);
    console.log(`  link:  ${payload.link}`);
    console.log(`  image: ${localPath} (${png.length} bytes)`);
    continue;
  }

  const result = await createPin(payload);
  published[pin.id] = {
    pinId: result.id,
    link: pin.link,
    boardId,
    publishedAt: new Date().toISOString(),
  };
  writePublished(published);
  console.log(`\npublished ${pin.id} → pin ${result.id}`);
  // gentle pacing
  await new Promise((r) => setTimeout(r, 1500));
}

console.log(dryRun ? "\nDry run done." : "\nDone.");
