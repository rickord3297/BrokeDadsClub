#!/usr/bin/env node
/**
 * Generate pin PNGs into merch/pinterest/output/
 * Usage: node merch/pinterest/export.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pins } from "./catalog.mjs";
import { outputDir } from "./env.mjs";
import { renderPinPng } from "./render.mjs";

mkdirSync(outputDir, { recursive: true });

const manifest = [];
for (const pin of pins) {
  const buffer = await renderPinPng(pin);
  const file = `${pin.id}.png`;
  const path = join(outputDir, file);
  writeFileSync(path, buffer);
  manifest.push({
    id: pin.id,
    file,
    link: pin.link,
    title: pin.title,
  });
  console.log(`wrote ${file}`);
}

writeFileSync(
  join(outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`\n${manifest.length} pins in ${outputDir}`);
