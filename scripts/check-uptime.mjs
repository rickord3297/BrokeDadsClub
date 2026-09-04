import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const watchFile = join(root, "content/uptime-sites.json");
const parsed = JSON.parse(readFileSync(watchFile, "utf8"));
const sites = Array.isArray(parsed.sites) ? parsed.sites : [];

if (sites.length === 0) {
  console.error("No sites listed in content/uptime-sites.json");
  process.exit(1);
}

const timeoutMs = 15_000;
let failed = 0;

for (const site of sites) {
  const name = typeof site.name === "string" ? site.name : "unnamed";
  const url = typeof site.url === "string" ? site.url : "";
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "BrokeDadsClub-uptime/1.0" },
    });
    const ms = Date.now() - started;
    if (!response.ok) {
      failed += 1;
      console.error(`DOWN  ${name} ${url} HTTP ${response.status} (${ms}ms)`);
      continue;
    }
    console.log(`OK    ${name} ${url} HTTP ${response.status} (${ms}ms)`);
  } catch (error) {
    failed += 1;
    const detail = error instanceof Error ? error.message : "request failed";
    console.error(`DOWN  ${name} ${url} ${detail}`);
  }
}

if (failed > 0) {
  console.error(`${failed} of ${sites.length} checks failed`);
  process.exit(1);
}

console.log(`${sites.length} site${sites.length === 1 ? "" : "s"} up`);
