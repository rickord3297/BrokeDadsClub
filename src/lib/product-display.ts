import type { Product, ProductArt } from "@/lib/products";

export const SHOP_FILTERS = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "hats", label: "Hats" },
  { id: "gear", label: "Gear / Pins" },
] as const;

export type ShopFilterId = (typeof SHOP_FILTERS)[number]["id"];

export function shopFilterForArt(art: ProductArt): Exclude<ShopFilterId, "all"> {
  if (art === "tee" || art === "hoodie") return "tees";
  if (art === "cap") return "hats";
  return "gear";
}

export function filterShopProducts(products: Product[], filter: ShopFilterId) {
  if (filter === "all") return products;
  return products.filter((product) => shopFilterForArt(product.art) === filter);
}

export function shopFilterCounts(products: Product[]) {
  const counts: Record<ShopFilterId, number> = {
    all: products.length,
    tees: 0,
    hats: 0,
    gear: 0,
  };
  for (const product of products) {
    counts[shopFilterForArt(product.art)] += 1;
  }
  return counts;
}

/** Approximate CSS fills for Printify / catalog color names. */
const COLOR_HEX: Record<string, string> = {
  white: "#f4f1ea",
  black: "#1c1915",
  navy: "#1f2f4d",
  "navy blue": "#1f2f4d",
  sand: "#d7c4a3",
  "sport grey": "#9b9b9b",
  "sport gray": "#9b9b9b",
  "athletic heather": "#b8b8b8",
  "graphite heather": "#5c5c5c",
  graphite: "#4a4a4a",
  charcoal: "#36454f",
  "military green": "#4b5320",
  "irish green": "#2f6b3a",
  forest: "#2d4a3e",
  maroon: "#6b2d3c",
  red: "#9b2c2c",
  "cardinal red": "#8b1e1e",
  royal: "#2f4f9b",
  "royal blue": "#2f4f9b",
  "light blue": "#9ec5e8",
  "carolina blue": "#7ba4db",
  pink: "#e8a0b0",
  "light pink": "#f0c4ce",
  orange: "#d9772f",
  gold: "#d4a84b",
  yellow: "#e6c84a",
  purple: "#5b3a7a",
  brown: "#6b4a2e",
  khaki: "#c3b091",
  natural: "#e8dfc8",
  ivory: "#f5f0e1",
  cream: "#f2e8d5",
  ash: "#cfcfcf",
  silver: "#c0c0c0",
  "dark chocolate": "#3b2416",
  "heather navy": "#3d4f6f",
  "heather red": "#a85a5a",
};

export function colorSwatchHex(color: string): string {
  const key = color.trim().toLowerCase();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  for (const [name, hex] of Object.entries(COLOR_HEX)) {
    if (key.includes(name) || name.includes(key)) return hex;
  }
  return "#8a8175";
}

export function productMaterialNote(product: Product): string {
  switch (product.art) {
    case "tee":
      return "100% ring-spun cotton · Pre-shrunk";
    case "hoodie":
      return "Heavy fleece blend · Kangaroo pocket";
    case "cap":
      return "Cotton crown · Adjustable fit";
    case "mug":
      return "Ceramic · Dishwasher-safe";
    case "sticker":
      return "Vinyl · Weather-resistant";
    case "patch":
      return product.slug.includes("pin")
        ? "Soft enamel pin · Rubber clutch"
        : "Iron-on or sew-on patch";
    default:
      return "";
  }
}

export const POD_SHIPPING_COPY =
  "Printed after you check out. Ships in 3-5 business days.";

export const TEE_SIZE_CHART = [
  { size: "S", chest: "34–37", length: "28" },
  { size: "M", chest: "38–41", length: "29" },
  { size: "L", chest: "42–45", length: "30" },
  { size: "XL", chest: "46–49", length: "31" },
  { size: "2XL", chest: "50–53", length: "32" },
  { size: "3XL", chest: "54–57", length: "33" },
] as const;

export const CASTLE_PIN_SLUG = "castle-pin";
