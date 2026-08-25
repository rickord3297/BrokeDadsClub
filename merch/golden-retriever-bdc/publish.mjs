import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = dirname(fileURLToPath(import.meta.url));

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

const env = loadEnv(join(dir, "../../.env.local"));
const token = env.PRINTIFY_API_TOKEN;
const shopId = env.PRINTIFY_SHOP_ID;
if (!token || !shopId) {
  throw new Error("Printify env is missing.");
}

const headers = {
  Authorization: `Bearer ${token}`,
  "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
  "Content-Type": "application/json",
};

const COLORS = [
  "White",
  "Sand",
  "Natural",
  "Sport Grey",
  "Graphite Heather",
  "Dark Heather",
  "Navy",
  "Black",
  "Military Green",
  "Sage",
];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const PRICE = 1999;
const BLUEPRINT_ID = 145;
const PRINT_PROVIDER_ID = 99;

async function printify(path, init = {}) {
  const response = await fetch(`https://api.printify.com/v1${path}`, {
    ...init,
    headers: { ...headers, ...init.headers },
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  if (!response.ok) {
    const err = new Error(
      `Printify ${init.method ?? "GET"} ${path} failed (${response.status}): ${body?.message ?? text.slice(0, 300)}`,
    );
    err.body = body;
    throw err;
  }
  return body;
}

const uploadPng = join(dir, "print-upload.png");
await sharp(join(dir, "print.png"))
  .resize({ width: 2400, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(uploadPng);

const contents = readFileSync(uploadPng).toString("base64");
console.log("uploading art", { bytes: readFileSync(uploadPng).length });

const uploaded = await printify("/uploads/images.json", {
  method: "POST",
  body: JSON.stringify({
    file_name: "club-dog-tee.png",
    contents,
  }),
});
console.log("uploaded", { id: uploaded.id, width: uploaded.width, height: uploaded.height });

const catalog = await printify(
  `/catalog/blueprints/${BLUEPRINT_ID}/print_providers/${PRINT_PROVIDER_ID}/variants.json`,
);
const colorSet = new Set(COLORS);
const sizeSet = new Set(SIZES);
const chosen = (catalog.variants ?? []).filter(
  (variant) =>
    colorSet.has(variant.options?.color) && sizeSet.has(variant.options?.size),
);

if (!chosen.length) {
  throw new Error("No matching shirt variants.");
}

const variants = chosen.map((variant) => ({
  id: variant.id,
  price: PRICE,
  is_enabled: true,
}));

const product = await printify(`/shops/${shopId}/products.json`, {
  method: "POST",
  body: JSON.stringify({
    title: "Club Dog Tee",
    description:
      "The club dog is sitting. BROKE DADS CLUB is under his paws so another dad in the pickup line might actually nod at you. Soft Gildan cotton, printed after you check out. For dads whose best coworker still has four paws.",
    tags: ["broke dads club", "golden retriever", "dog dad", "tee"],
    blueprint_id: BLUEPRINT_ID,
    print_provider_id: PRINT_PROVIDER_ID,
    variants,
    print_areas: [
      {
        variant_ids: variants.map((variant) => variant.id),
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: uploaded.id,
                x: 0.5,
                y: 0.4,
                scale: 0.72,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  }),
});

console.log("created", {
  id: product.id,
  variantCount: variants.length,
  colors: [...new Set(chosen.map((v) => v.options.color))],
});

await printify(`/shops/${shopId}/products/${product.id}/publish.json`, {
  method: "POST",
  body: JSON.stringify({
    title: true,
    description: true,
    images: true,
    variants: true,
    tags: true,
    keyFeatures: true,
    shipping_template: true,
  }),
});
console.log("publish started");

const handle = `https://brokedadsclub.com/shop/club-dog-tee`;
try {
  await printify(
    `/shops/${shopId}/products/${product.id}/publishing_succeeded.json`,
    {
      method: "POST",
      body: JSON.stringify({
        external: { id: product.id, handle },
      }),
    },
  );
  console.log("publish handshake ok");
} catch (error) {
  console.log("publish handshake skipped", error.message);
}

let images = product.images ?? [];
for (let attempt = 1; attempt <= 12 && images.length < 4; attempt++) {
  await new Promise((resolve) => setTimeout(resolve, 8000));
  const latest = await printify(`/shops/${shopId}/products/${product.id}.json`);
  images = latest.images ?? [];
  console.log("mockups", { attempt, count: images.length });
}

const result = {
  id: product.id,
  title: product.title,
  handle,
  colors: [...new Set(chosen.map((v) => v.options.color))],
  sizes: [...new Set(chosen.map((v) => v.options.size))],
  price_cents: PRICE,
  mockupCount: images.length,
  firstMockup: images[0]?.src ?? null,
};
writeFileSync(join(dir, "printify-result.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
