const PRINTIFY_API = "https://api.printify.com/v1";

export type PrintifyAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

export type PrintifyLineItem = {
  sku: string;
  quantity: number;
};

type PrintifyOptionValue = { id: number; title: string };

type PrintifyCatalogProduct = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  visible?: boolean;
  is_deleted?: boolean;
  blueprint_id?: number;
  images?: Array<{
    src: string;
    is_default?: boolean;
    is_selected_for_publishing?: boolean;
    position?: string;
    variant_ids?: number[];
  }>;
  options?: Array<{
    name: string;
    type: string;
    values: PrintifyOptionValue[];
  }>;
  variants?: Array<{
    id: number;
    sku: string;
    price: number;
    title: string;
    is_enabled: boolean;
    is_available: boolean;
    options: number[];
  }>;
};

export type PrintifyVariant = {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  price_cents: number;
};

export type PrintifyPhoto = {
  src: string;
  color?: string;
  angle: "front" | "back" | "lifestyle" | "other";
};

export function isPrintifyConfigured() {
  return Boolean(process.env.PRINTIFY_API_TOKEN && process.env.PRINTIFY_SHOP_ID);
}

/** Fallback SKU pattern for seed products that are not in Printify. */
export function printifySku(slug: string, size?: string) {
  return size ? `${slug}-${size.toLowerCase()}` : slug;
}

async function printifyFetch(path: string) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new Error("Printify is not configured.");
  }

  const response = await fetch(`${PRINTIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
    },
    next: { revalidate: 120, tags: ["printify-products"] },
  });

  if (!response.ok) {
    throw new Error(`Printify request failed (${response.status}).`);
  }

  return response.json();
}

export async function listPrintifyCatalog() {
  if (!isPrintifyConfigured()) return [];

  const shopId = process.env.PRINTIFY_SHOP_ID;
  const first = (await printifyFetch(
    `/shops/${shopId}/products.json?limit=50&page=1`,
  )) as {
    data?: PrintifyCatalogProduct[];
    last_page?: number;
  };

  const pages = Math.max(1, first.last_page ?? 1);
  const rest =
    pages > 1
      ? await Promise.all(
          Array.from({ length: pages - 1 }, (_, index) =>
            printifyFetch(
              `/shops/${shopId}/products.json?limit=50&page=${index + 2}`,
            ) as Promise<{ data?: PrintifyCatalogProduct[] }>,
          ),
        )
      : [];

  return [first, ...rest]
    .flatMap((page) => page.data ?? [])
    .filter((product) => product.visible && !product.is_deleted);
}

export function variantsFromPrintifyProduct(product: PrintifyCatalogProduct) {
  const sizeValues = new Map(
    (product.options?.find((option) => option.type === "size")?.values ?? []).map(
      (value) => [value.id, value.title],
    ),
  );
  const colorValues = new Map(
    (product.options?.find((option) => option.type === "color")?.values ?? []).map(
      (value) => [value.id, value.title],
    ),
  );

  const variants: PrintifyVariant[] = [];
  for (const variant of product.variants ?? []) {
    if (!variant.is_enabled || !variant.is_available || !variant.sku) continue;
    variants.push({
      id: variant.id,
      sku: variant.sku,
      size: variant.options.map((id) => sizeValues.get(id)).find(Boolean),
      color: variant.options.map((id) => colorValues.get(id)).find(Boolean),
      price_cents: variant.price,
    });
  }
  return variants;
}

function photoAngle(image: NonNullable<PrintifyCatalogProduct["images"]>[number]): PrintifyPhoto["angle"] {
  const src = image.src ?? "";
  if (image.position === "front" || src.includes("camera_label=front")) return "front";
  if (image.position === "back" || src.includes("camera_label=back")) return "back";
  if (src.includes("camera_label=lifestyle")) return "lifestyle";
  return "other";
}

export function printifyProductGallery(
  product: PrintifyCatalogProduct,
  variants: PrintifyVariant[],
): PrintifyPhoto[] {
  const colorByVariantId = new Map(
    variants
      .filter((variant) => variant.color)
      .map((variant) => [variant.id, variant.color as string]),
  );
  const photos: PrintifyPhoto[] = [];
  const seen = new Set<string>();

  for (const image of product.images ?? []) {
    if (image.is_selected_for_publishing === false) continue;
    const src = image.src ?? "";
    if (!src || src.includes("camera_label=folded")) continue;
    const angle = photoAngle(image);
    if (angle === "other") continue;

    const colors = [
      ...new Set(
        (image.variant_ids ?? [])
          .map((id) => colorByVariantId.get(id))
          .filter((color): color is string => Boolean(color)),
      ),
    ];
    const colorKeys = colors.length ? colors : [undefined];
    for (const color of colorKeys) {
      const key = `${color ?? "any"}:${angle}`;
      if (seen.has(key)) continue;
      seen.add(key);
      photos.push({ src, color, angle });
    }
  }

  const rank = { front: 0, lifestyle: 1, back: 2, other: 3 };
  return photos.sort((a, b) => {
    const colorRank = (color?: string) => (color === "White" ? 0 : 1);
    const colorCmp = colorRank(a.color) - colorRank(b.color) || (a.color ?? "").localeCompare(b.color ?? "");
    if (colorCmp !== 0) return colorCmp;
    return rank[a.angle] - rank[b.angle];
  });
}

export function printifyProductImage(product: PrintifyCatalogProduct) {
  return printifyProductGallery(product, variantsFromPrintifyProduct(product))[0]?.src;
}

export function printifyProductCopy(product: PrintifyCatalogProduct) {
  const description = (product.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    title: product.title.trim(),
    description:
      description.slice(0, 400) ||
      "Club merch. Printify prints it after you check out.",
    tags: product.tags ?? [],
  };
}

export async function createPrintifyOrder(input: {
  externalId: string;
  label?: string;
  lineItems: PrintifyLineItem[];
  address: PrintifyAddress;
}) {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopId) {
    throw new Error("Printify is not configured.");
  }

  const response = await fetch(`${PRINTIFY_API}/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
    },
    body: JSON.stringify({
      external_id: input.externalId,
      label: input.label ?? input.externalId,
      line_items: input.lineItems,
      shipping_method: 1,
      send_shipping_notification: false,
      address_to: input.address,
    }),
  });

  const payload = (await response.json()) as {
    id?: string;
    status?: string;
    message?: string;
    errors?: unknown;
  };

  if (!response.ok || !payload.id) {
    throw new Error(
      payload.message ?? `Printify order failed (${response.status}).`,
    );
  }

  return { id: payload.id, status: payload.status ?? "pending" };
}

export async function getPrintifyProduct(productId: string) {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopId) {
    throw new Error("Printify is not configured.");
  }

  const response = await fetch(
    `${PRINTIFY_API}/shops/${shopId}/products/${productId}.json`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Printify product lookup failed (${response.status}).`);
  }

  return (await response.json()) as PrintifyCatalogProduct;
}

/** Completes a custom-store publish so Printify unlocks the product for editing. */
export async function markPrintifyPublishSucceeded(
  productId: string,
  handle: string,
) {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopId) {
    throw new Error("Printify is not configured.");
  }

  const response = await fetch(
    `${PRINTIFY_API}/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
      },
      body: JSON.stringify({
        external: {
          id: productId,
          handle,
        },
      }),
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      payload.message ?? `Printify publish handshake failed (${response.status}).`,
    );
  }
}
