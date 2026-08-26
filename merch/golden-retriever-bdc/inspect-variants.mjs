import { readFileSync, writeFileSync } from "node:fs";

function loadEnv(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnv(new URL("../../.env.local", import.meta.url).pathname);
const headers = {
  Authorization: `Bearer ${env.PRINTIFY_API_TOKEN}`,
  "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
};

const product = await (
  await fetch(
    `https://api.printify.com/v1/shops/${env.PRINTIFY_SHOP_ID}/products/6a7fcaa74f40ed8f8107ca0f.json`,
    { headers },
  )
).json();

const variants = await (
  await fetch(
    "https://api.printify.com/v1/catalog/blueprints/145/print_providers/99/variants.json",
    { headers },
  )
).json();

const front = product.print_areas?.[0]?.placeholders?.find((p) => p.position === "front");
const colors = [
  ...new Set((variants.variants ?? []).map((v) => v.options?.color).filter(Boolean)),
];

writeFileSync(
  new URL("./club-pup-front.json", import.meta.url),
  JSON.stringify(
    {
      front,
      catalogVariantSample: (variants.variants ?? []).slice(0, 2),
      colors,
      catalogCount: variants.variants?.length,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      frontImages: front?.images?.map((img) => ({
        id: img.id,
        name: img.name,
        type: img.type,
        x: img.x,
        y: img.y,
        scale: img.scale,
        angle: img.angle,
        width: img.width,
        height: img.height,
      })),
      colors,
      catalogCount: variants.variants?.length,
    },
    null,
    2,
  ),
);
