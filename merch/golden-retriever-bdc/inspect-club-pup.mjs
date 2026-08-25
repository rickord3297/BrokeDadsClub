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
const token = env.PRINTIFY_API_TOKEN;
const shopId = env.PRINTIFY_SHOP_ID;
const productId = "6a7fcaa74f40ed8f8107ca0f";

const res = await fetch(
  `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
    },
  },
);

const product = await res.json();
if (!res.ok) {
  console.error("lookup failed", res.status, product?.message ?? product);
  process.exit(1);
}

const colorValues = product.options?.find((o) => o.type === "color")?.values ?? [];
const sizeValues = product.options?.find((o) => o.type === "size")?.values ?? [];
const enabled = (product.variants ?? []).filter((v) => v.is_enabled);
const colors = [
  ...new Set(
    enabled.map((v) => {
      const colorId = v.options?.find((id) => colorValues.some((c) => c.id === id));
      return colorValues.find((c) => c.id === colorId)?.title;
    }),
  ),
];

const printArea = product.print_areas?.[0];
const image = printArea?.placeholders
  ?.flatMap((p) => p.images ?? [])
  ?.find((img) => img.type !== "text/svg");

console.log(
  JSON.stringify(
    {
      title: product.title,
      blueprint_id: product.blueprint_id,
      print_provider_id: product.print_provider_id,
      visible: product.visible,
      colors,
      sizes: sizeValues.map((s) => s.title),
      enabledCount: enabled.length,
      variantCount: product.variants?.length,
      sampleEnabled: enabled.slice(0, 3).map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
      })),
      placeholderPositions: printArea?.placeholders?.map((p) => p.position),
      image: image
        ? {
            id: image.id,
            x: image.x,
            y: image.y,
            scale: image.scale,
            angle: image.angle,
            width: image.width,
            height: image.height,
          }
        : null,
    },
    null,
    2,
  ),
);
