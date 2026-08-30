import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function loadEnv(path = join(repoRoot, ".env.local")) {
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

export function createPrintifyClient(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
    "Content-Type": "application/json",
  };

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
      throw new Error(
        `Printify ${init.method ?? "GET"} ${path} failed (${response.status}): ${body?.message ?? text.slice(0, 300)}`,
      );
    }
    return body;
  }

  return printify;
}

export async function uploadPrintImage(printify, printPath, fileName) {
  const uploadPng = printPath.replace(/\.png$/, "-upload.png");
  await sharp(printPath)
    .resize({ width: 2400, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(uploadPng);

  const contents = readFileSync(uploadPng).toString("base64");
  console.log("uploading art", { fileName, bytes: readFileSync(uploadPng).length });

  return printify("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, contents }),
  });
}

export function pickVariants(catalog, { colors, sizes }) {
  const colorSet = new Set(colors);
  const sizeSet = sizes?.length ? new Set(sizes) : null;
  const chosen = (catalog.variants ?? []).filter((variant) => {
    const colorOk = colorSet.has(variant.options?.color);
    const sizeOk = !sizeSet || sizeSet.has(variant.options?.size);
    return colorOk && sizeOk;
  });
  if (!chosen.length) {
    const available = [
      ...new Set((catalog.variants ?? []).map((v) => v.options?.color).filter(Boolean)),
    ];
    throw new Error(
      `No matching variants. Wanted [${colors.join(", ")}]. Available: [${available.slice(0, 20).join(", ")}]`,
    );
  }
  return chosen;
}

export async function publishProduct({
  printify,
  shopId,
  printPath,
  uploadFileName,
  slug,
  title,
  description,
  tags,
  blueprintId,
  printProviderId,
  colors,
  sizes,
  priceCents,
  placement = { position: "front", x: 0.5, y: 0.4, scale: 0.56 },
  resultPath,
}) {
  const uploaded = await uploadPrintImage(printify, printPath, uploadFileName);

  const catalog = await printify(
    `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
  );
  const chosen = pickVariants(catalog, { colors, sizes });
  const variants = chosen.map((variant) => ({
    id: variant.id,
    price: priceCents,
    is_enabled: true,
  }));

  const product = await printify(`/shops/${shopId}/products.json`, {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      tags,
      blueprint_id: blueprintId,
      print_provider_id: printProviderId,
      variants,
      print_areas: [
        {
          variant_ids: variants.map((variant) => variant.id),
          placeholders: [
            {
              position: placement.position,
              images: [
                {
                  id: uploaded.id,
                  x: placement.x,
                  y: placement.y,
                  scale: placement.scale,
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
    title: product.title,
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

  const handle = `https://brokedadsclub.com/shop/${slug}`;
  try {
    await printify(`/shops/${shopId}/products/${product.id}/publishing_succeeded.json`, {
      method: "POST",
      body: JSON.stringify({ external: { id: product.id, handle } }),
    });
    console.log("publish handshake ok");
  } catch (error) {
    console.log("publish handshake skipped", error.message);
  }

  let images = product.images ?? [];
  for (let attempt = 1; attempt <= 12 && images.length < 4; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    const latest = await printify(`/shops/${shopId}/products/${product.id}.json`);
    images = latest.images ?? [];
    console.log("mockups", { attempt, count: images.length });
  }

  const frontMockup =
    images.find(
      (img) => img.position === "front" && img.src?.includes("camera_label=front"),
    )?.src ??
    images[0]?.src ??
    null;

  const result = {
    id: product.id,
    title: product.title,
    handle,
    slug,
    blueprint_id: blueprintId,
    print_provider_id: printProviderId,
    colors: [...new Set(chosen.map((v) => v.options.color))],
    sizes: [...new Set(chosen.map((v) => v.options.size).filter(Boolean))],
    price_cents: priceCents,
    mockupCount: images.length,
    firstMockup: frontMockup,
  };

  if (resultPath) {
    writeFileSync(resultPath, JSON.stringify(result, null, 2));
  }
  console.log(JSON.stringify(result, null, 2));
  return result;
}
