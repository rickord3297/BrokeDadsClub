import { readFileSync } from "node:fs";

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
const id = "6a811a3803218922dd0a8389";
const product = await (
  await fetch(
    `https://api.printify.com/v1/shops/${env.PRINTIFY_SHOP_ID}/products/${id}.json`,
    {
      headers: {
        Authorization: `Bearer ${env.PRINTIFY_API_TOKEN}`,
        "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
      },
    },
  )
).json();

const images = product.images ?? [];
const positions = {};
for (const image of images) {
  const key = `${image.position ?? "?"}:${image.src?.includes("camera_label=front") ? "frontcam" : image.src?.includes("folded") ? "folded" : "other"}`;
  positions[key] = (positions[key] ?? 0) + 1;
}
const enabled = (product.variants ?? []).filter((v) => v.is_enabled);
const prices = [...new Set(enabled.map((v) => v.price))];
const colors = [
  ...new Set(
    enabled.map((v) => v.title?.split(" / ")[0]).filter(Boolean),
  ),
];

console.log(
  JSON.stringify(
    {
      id: product.id,
      title: product.title,
      visible: product.visible,
      imageCount: images.length,
      positions,
      enabledCount: enabled.length,
      prices,
      colors,
      sampleFront: images.find(
        (img) =>
          img.position === "front" &&
          !img.src?.includes("folded") &&
          (img.src?.includes("camera_label=front") || img.position === "front"),
      )?.src,
    },
    null,
    2,
  ),
);
