import type { Product, ProductArt } from "@/lib/products";

export const SHOP_FILTERS = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "fleece", label: "Fleece" },
  { id: "hats", label: "Hats" },
  { id: "bags", label: "Bags" },
  { id: "gear", label: "Gear / Pins" },
] as const;

export type ShopFilterId = (typeof SHOP_FILTERS)[number]["id"];

export function shopFilterForArt(art: ProductArt): Exclude<ShopFilterId, "all"> {
  if (art === "tee") return "tees";
  if (art === "hoodie") return "fleece";
  if (art === "cap") return "hats";
  if (art === "tote") return "bags";
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
    fleece: 0,
    hats: 0,
    bags: 0,
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
  pepper: "#3d4035",
  moss: "#6b6f4a",
  bay: "#6b7f8f",
  "blue spruce": "#4a6670",
  terracotta: "#b56a4a",
  denim: "#5a6f8a",
  chambray: "#8fa3b8",
  "true navy": "#2a3444",
  "blue jean": "#6a7f96",
  camel: "#c4a574",
  coal: "#3a3a38",
  cocoa: "#6b4f3f",
  dust: "#9a9088",
  "vintage navy": "#3d4a5c",
  "hunter green": "#3d4f3a",
  asphalt: "#4a4a48",
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
  if (product.slug.includes("vintage-tee")) {
    return "Garment-dyed cotton · 6.1 oz · Pre-shrunk";
  }
  if (product.slug.includes("heavy-tee")) {
    return "Heavyweight cotton · 7.5 oz · Boxy fit";
  }
  switch (product.art) {
    case "tee":
      return "100% ring-spun cotton · Pre-shrunk";
    case "hoodie":
      return product.slug.includes("crewneck")
        ? "Garment-dyed fleece · Crewneck"
        : "Garment-dyed fleece · Kangaroo pocket";
    case "cap":
      return "Cotton crown · Adjustable fit";
    case "tote":
      return "Canvas · One size";
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

export const POD_SHIPPING_COPY = "Ships in 3-5 business days.";

export const SHOP_FAQ = [
  {
    question: "How long does shipping take?",
    answer:
      "Most orders ship in 3-5 business days. You will get an email with tracking when it leaves the warehouse.",
  },
  {
    question: "When is my order made?",
    answer:
      "Each item is made to order when you buy it. That keeps waste down and lets us run the shop without a garage full of boxes.",
  },
  {
    question: "What if something arrives wrong?",
    answer:
      "Email us through the About page contact form with your order details and a photo. We will make it right.",
  },
  {
    question: "What blanks do you use?",
    answer:
      "Premium crest tees use garment-dyed Comfort Colors and heavyweight cotton. Fleece is Comfort Colors too. Standard designs stay on soft Gildan cotton at a lower price point.",
  },
  {
    question: "Where does the money go?",
    answer:
      "Shop sales help keep the guides and printables free. Wear it if you want. Skip it if the grocery list wins this week.",
  },
] as const;

export const TEE_SIZE_CHART = [
  { size: "S", chest: "34–37", length: "28" },
  { size: "M", chest: "38–41", length: "29" },
  { size: "L", chest: "42–45", length: "30" },
  { size: "XL", chest: "46–49", length: "31" },
  { size: "2XL", chest: "50–53", length: "32" },
  { size: "3XL", chest: "54–57", length: "33" },
] as const;

export const CASTLE_PIN_SLUG = "castle-pin";
