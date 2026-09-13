#!/usr/bin/env node
/**
 * List boards so you can set PINTEREST_BOARD_ID in .env.local
 * Usage: node merch/pinterest/list-boards.mjs
 */

import { listBoards } from "./api.mjs";

const boards = await listBoards();
if (!boards.length) {
  console.log("No boards found. Create one on Pinterest, then re-run.");
  process.exit(0);
}

console.log("Boards:\n");
for (const board of boards) {
  console.log(`  ${board.name}`);
  console.log(`    id: ${board.id}`);
  console.log(`    ${board.privacy || "PUBLIC"} · ${board.pin_count ?? "?"} pins`);
  console.log("");
}
console.log("Copy an id into .env.local as PINTEREST_BOARD_ID=...");
