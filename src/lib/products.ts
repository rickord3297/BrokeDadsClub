import { cache } from "react";
import { clubProductCopy } from "@/lib/product-copy";
import {
  isPrintifyConfigured,
  listPrintifyCatalog,
  printifyProductCopy,
  printifyProductGallery,
  variantsFromPrintifyProduct,
  type PrintifyPhoto,
  type PrintifyVariant,
} from "@/lib/printify";
import { createPublicClient } from "@/lib/supabase/public";

export type ProductArt = "tee" | "mug" | "cap" | "sticker" | "hoodie" | "patch";

export const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"] as const;

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  art: ProductArt;
  image?: string;
  images?: PrintifyPhoto[];
  image_fit?: "cover" | "contain";
  active: boolean;
  variants?: PrintifyVariant[];
  defaultSize?: string;
};

export function productNeedsSize(product: Product) {
  if (product.variants?.length) {
    return product.variants.some((variant) => Boolean(variant.size));
  }
  return product.art === "tee" || product.art === "hoodie";
}

export function productSizes(product: Product, color?: string) {
  const sizes = [
    ...new Set(
      (product.variants ?? [])
        .filter((variant) => !color || !variant.color || variant.color === color)
        .map((variant) => variant.size)
        .filter((size): size is string => Boolean(size)),
    ),
  ];
  return sizes.sort(
    (a, b) =>
      APPAREL_SIZES.indexOf(a as (typeof APPAREL_SIZES)[number]) -
      APPAREL_SIZES.indexOf(b as (typeof APPAREL_SIZES)[number]),
  );
}

export function productColors(product: Product) {
  const colors = [
    ...new Set(
      (product.variants ?? [])
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color)),
    ),
  ];
  return colors.sort((a, b) => {
    if (a === "White") return -1;
    if (b === "White") return 1;
    return a.localeCompare(b);
  });
}

export function findVariant(
  product: Product,
  selection: { size?: string; color?: string },
) {
  const variants = product.variants ?? [];
  return (
    variants.find((variant) => {
      const sizeOk = !selection.size || variant.size === selection.size;
      const colorOk = !selection.color || variant.color === selection.color;
      return sizeOk && colorOk;
    }) ?? null
  );
}

export function productPriceRange(product: Product) {
  const prices = [
    ...new Set(
      (product.variants ?? [])
        .map((variant) => variant.price_cents)
        .filter((price) => price > 0),
    ),
  ];
  if (!prices.length) {
    return { min: product.price_cents, max: product.price_cents };
  }
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Short label for size/color availability on product cards. */
export function productVariantSummary(product: Product): string {
  const sizes = productSizes(product);
  const colors = productColors(product);
  const parts: string[] = [];

  if (productNeedsSize(product)) {
    parts.push(sizes.length ? `${sizes.length} sizes` : "Pick a size");
  }
  if (colors.length > 1) {
    parts.push(`${colors.length} colors`);
  } else if (colors.length === 1) {
    parts.push(colors[0]);
  }

  return parts.length ? parts.join(" · ") : "In stock";
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

export function printifyProductSlug(productId: string, title: string) {
  return printifyCopyOverrides[productId]?.slug ?? slugify(title);
}

function artFromPrintify(title: string, tags: string[]): ProductArt {
  const haystack = `${title} ${tags.join(" ")}`.toLowerCase();
  if (haystack.includes("hoodie") || haystack.includes("sweatshirt")) return "hoodie";
  if (haystack.includes("mug")) return "mug";
  if (haystack.includes("cap") || haystack.includes("hat")) return "cap";
  if (haystack.includes("sticker")) return "sticker";
  if (haystack.includes("patch") || haystack.includes("pin")) return "patch";
  return "tee";
}

/** Local iron-on patches stay off. Printify pins, caps, and tees can list. */
function isShopListed(product: Product) {
  return product.slug !== "club-patch" && product.slug !== "candy-stripe-patch";
}

const printifyCopyOverrides: Record<
  string,
  {
    slug: string;
    name: string;
    description: string;
    price_cents?: number;
    defaultSize?: string;
  }
> = {
  "6a7fcaa74f40ed8f8107ca0f": {
    slug: "club-pup-tee",
    name: "Club Pup Tee",
    description:
      "The club dog is on his back. The wrench is in the grass. BROKE DADS CLUB is on the chest so another dad in the pickup line might actually nod at you. Soft Gildan cotton, printed after you check out. White, graphite heather, or military green. For dads whose best coworker still has four paws.",
    price_cents: 1999,
  },
  "6a811a3803218922dd0a8389": {
    slug: "club-dog-tee",
    name: "Club Dog Tee",
    description:
      "The club dog is sitting. BROKE DADS CLUB is under his paws so another dad in the pickup line might actually nod at you. Soft Gildan cotton, printed after you check out. White, sand, navy, black, and the rest of the dad palette. For dads whose best coworker still has four paws.",
    price_cents: 1999,
  },
  "6a826ed4aaef37be24051e48": {
    slug: "broke-not-broken-tee",
    name: "Broke Not Broken Tee",
    description:
      "Broke. NOT. Broken. Soft Gildan cotton, printed after you check out. For dads who are stretched thin and still in the game.",
    price_cents: 1999,
  },
  "6a8cf0c0302c505a980a6b0f": {
    slug: "castle-crest-tee",
    name: "Castle Crest Tee",
    description:
      "The official Broke Dads Club crest. Castle you cannot actually afford, printed on soft Gildan cotton after you check out. White, sand, navy, black, and the rest of the dad palette.",
    price_cents: 1999,
  },
  "6a8cf686dcfffff79a00cac4": {
    slug: "club-crest-tee",
    name: "Club Crest Tee",
    description:
      "The new Broke Dads Club crest on soft Gildan cotton, printed after you check out. Castle you cannot actually afford. White, sand, navy, black, and the rest of the dad palette.",
    price_cents: 1999,
  },
  "6a8cf69ccef0457f720f277e": {
    slug: "club-crest-cap",
    name: "Club Crest Cap",
    description:
      "Sunwashed rope cap with the official Broke Dads Club crest up front. Five-panel, curved bill, braided rope. Tip it at the pickup line.",
    price_cents: 2500,
  },
  "6a8f5ce06177c5df1f08f6bc": {
    slug: "dad-of-all-trades-tee",
    name: "Dad of All Trades Tee",
    description:
      "Plumber. Driver. Carpenter. Husband. Dad of all trades. Soft Gildan cotton, printed after you check out. For the guy who still fixes it himself.",
    price_cents: 1999,
  },
  "6a938cdb838a5c7b9a0d7f8e": {
    slug: "distressed-dad-tee",
    name: "Distressed DAD Tee",
    description:
      "DAD in distressed cream type on soft Gildan cotton. Vintage worn-in look, no joke caption. Dark colors only: black, navy, dark heather, graphite heather, military green, and sport grey.",
    price_cents: 1999,
  },
  "6a7fd6ba2cde8b7dc1033d3f": {
    slug: "castle-pin",
    name: "Castle Pin",
    description:
      "The official club crest, in pin form. Navy, tan, and a castle you cannot actually afford. Stick it on the jacket that has seen every school drop-off.",
    price_cents: 500,
    defaultSize: "2.25\"",
  },
};

function isRetailLooking(cents: number) {
  const remainder = cents % 100;
  return remainder === 0 || remainder === 50 || remainder === 95 || remainder === 99;
}

function catalogPricing(variants: PrintifyVariant[], overridePrice?: number) {
  if (overridePrice && overridePrice > 0) {
    return { price_cents: overridePrice, flatten: true };
  }
  const prices = variants.map((variant) => variant.price_cents).filter((price) => price > 0);
  const retail = prices.filter(isRetailLooking);
  const pool = retail.length ? retail : prices;
  const unique = [...new Set(pool)];
  if (unique.length === 1) {
    return { price_cents: unique[0], flatten: true };
  }
  return { price_cents: Math.min(...pool), flatten: false };
}

export function initialSize(product: Product, sizes: string[]) {
  if (product.defaultSize && sizes.includes(product.defaultSize)) {
    return product.defaultSize;
  }
  if (sizes.includes("L")) return "L";
  return sizes[0] ?? "";
}

async function getPrintifyProducts(): Promise<Product[]> {
  if (!isPrintifyConfigured()) return [];
  try {
    const catalog = await listPrintifyCatalog();
    return catalog
      .map((row) => {
        const variants = variantsFromPrintifyProduct(row);
        const copy = printifyProductCopy(row);
        const images = printifyProductGallery(row, variants);
        const image = images[0]?.src;
        if (!variants.length || !image) return null;
        const override = printifyCopyOverrides[row.id];
        const art = artFromPrintify(override?.name ?? copy.title, copy.tags);
        const pricing = catalogPricing(variants, override?.price_cents);
        const clubCopy = clubProductCopy({
          title: override?.name ?? copy.title,
          art,
          rawDescription: copy.description,
        });
        return {
          id: row.id,
          slug: override?.slug ?? slugify(copy.title),
          name: override?.name ?? clubCopy.name,
          description: override?.description ?? clubCopy.description,
          price_cents: pricing.price_cents,
          category: art === "tee" || art === "hoodie" || art === "cap" ? "Apparel" : "Gear",
          art,
          image,
          images,
          active: true,
          defaultSize: override?.defaultSize,
          variants: pricing.flatten
            ? variants.map((variant) => ({ ...variant, price_cents: pricing.price_cents }))
            : variants,
        };
      })
      .filter((product) => product !== null)
      .filter(isShopListed);
  } catch (error) {
    console.error("Printify catalog failed", error);
    return [];
  }
}

async function getLocalPhotoProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, description, price_cents, category, art, image, image_fit, active",
      )
      .eq("active", true)
      .order("price_cents", { ascending: true });

    if (!error && data?.length) {
      return data.filter(isProduct).filter(hasProductPhoto).filter(isShopListed);
    }
  }

  return seedProducts
    .filter((product) => product.active && hasProductPhoto(product))
    .filter(isShopListed);
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const [printify, local] = await Promise.all([
    getPrintifyProducts(),
    getLocalPhotoProducts(),
  ]);
  const slugs = new Set(printify.map((product) => product.slug));
  return [...printify, ...local.filter((product) => !slugs.has(product.slug))];
});

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const products = await getProducts();
  return slugs.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
}

/** Homepage shop preview: best sellers and brand anchors. */
export const HOME_SHOP_SLUGS = [
  "club-crest-cap",
  "club-pup-tee",
  "castle-crest-tee",
] as const;

export async function getHomeShopProducts(): Promise<Product[]> {
  const curated = await getProductsBySlugs([...HOME_SHOP_SLUGS]);
  if (curated.length >= 2) return curated.slice(0, 3);
  const products = await getProducts();
  return products.slice(0, 3);
}

export const seedProducts: Product[] = [
  {
    id: "prod_club_patch",
    slug: "club-patch",
    name: "Castle Patch",
    description:
      "The official club crest. Navy, tan, and a castle you cannot actually afford. Iron-on or sew it to the jacket that has seen every school drop-off.",
    price_cents: 1200,
    category: "Gear",
    art: "patch",
    image: "/brand/club-patch.png",
    active: false,
  },
  {
    id: "prod_stripe_patch",
    slug: "candy-stripe-patch",
    name: "Candy-Stripe Castle Patch",
    description:
      "Same club, louder border. Teal field, copper candy-stripe merrow, puff-white letters. Sew it on the jacket the theme park never saw a dime from.",
    price_cents: 1200,
    category: "Gear",
    art: "patch",
    image: "/brand/club-patch-stripe.png",
    active: false,
  },
  {
    id: "prod_club_pup_tee",
    slug: "club-pup-tee",
    name: "Club Pup Tee",
    description:
      "The club dog is on his back. The wrench is in the grass. BROKE DADS CLUB is on the chest so another dad in the pickup line might actually nod at you. Soft Gildan cotton, printed after you check out.",
    price_cents: 2800,
    category: "Apparel",
    art: "tee",
    image: "/brand/club-pup-tee.jpg",
    image_fit: "contain",
    active: false,
  },
  {
    id: "prod_club_tee",
    slug: "club-tee",
    name: "Official Club Tee",
    description:
      "Soft cotton. Loud enough that another dad in the pickup line might nod at you. That's the whole marketing plan.",
    price_cents: 2800,
    category: "Apparel",
    art: "tee",
    active: false,
  },
  {
    id: "prod_block_castle_tee",
    slug: "block-castle-tee",
    name: "Block Castle Tee",
    description:
      "Toy blocks, toy cars, pacifiers, and a pile of money you no longer have. Soft cotton, black tee, the whole dad economy on the chest.",
    price_cents: 2800,
    category: "Apparel",
    art: "tee",
    image: "/brand/block-castle-tee.png",
    image_fit: "contain",
    active: false,
  },
  {
    id: "prod_hoodie",
    slug: "club-hoodie",
    name: "School-Run Hoodie",
    description:
      "The one you live in from October to April. Heavy fleece, kangaroo pocket for snacks, and a wordmark that says you belong here.",
    price_cents: 4800,
    category: "Apparel",
    art: "hoodie",
    active: false,
  },
  {
    id: "prod_cap",
    slug: "dad-cap",
    name: "Low-Profile Dad Cap",
    description:
      "Covers a haircut you keep meaning to get. Unstructured crown. Adjustable. No neon. No excuses.",
    price_cents: 2400,
    category: "Apparel",
    art: "cap",
    active: false,
  },
  {
    id: "prod_mug",
    slug: "broke-mug",
    name: "Broke Doesn't Mean Broken Mug",
    description:
      "12 oz of whatever is keeping you vertical. Dishwasher-safe because nobody in this house is hand-washing a mug at 6:40 a.m.",
    price_cents: 1600,
    category: "Home",
    art: "mug",
    active: false,
  },
  {
    id: "prod_stickers",
    slug: "sticker-pack",
    name: "Laptop / Water-Bottle Pack",
    description:
      "Five weatherproof stickers. Put them on the dented bottle, the work laptop, the minivan that still has goldfish in the seats.",
    price_cents: 800,
    category: "Gear",
    art: "sticker",
    active: false,
  },
];

/** Only sell items with real product photos (no placeholder art). */
function hasProductPhoto(product: Product): boolean {
  if (typeof product.image !== "string" || product.image.length === 0) {
    return false;
  }
  // Print files on a dark square are not on-garment mockups. Hold apparel
  // until Printify (or a photo) shows the design on the actual product.
  if (
    (product.art === "tee" || product.art === "hoodie") &&
    product.image_fit === "contain"
  ) {
    return false;
  }
  return true;
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  const baseOk =
    typeof row.id === "string" &&
    typeof row.slug === "string" &&
    typeof row.name === "string" &&
    typeof row.description === "string" &&
    typeof row.price_cents === "number" &&
    typeof row.category === "string" &&
    typeof row.art === "string" &&
    typeof row.active === "boolean";
  if (!baseOk) return false;

  if (row.image != null && typeof row.image !== "string") return false;
  if (row.image_fit != null && row.image_fit !== "cover" && row.image_fit !== "contain") {
    return false;
  }

  // Normalize nulls from Postgres into undefined for the Product type.
  if (row.image == null) delete row.image;
  if (row.image_fit == null) delete row.image_fit;
  return true;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}
