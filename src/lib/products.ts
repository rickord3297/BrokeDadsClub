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

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

function artFromPrintify(title: string, tags: string[]): ProductArt {
  const haystack = `${title} ${tags.join(" ")}`.toLowerCase();
  if (haystack.includes("hoodie") || haystack.includes("sweatshirt")) return "hoodie";
  if (haystack.includes("mug")) return "mug";
  if (haystack.includes("cap") || haystack.includes("hat")) return "cap";
  if (haystack.includes("sticker")) return "sticker";
  if (haystack.includes("patch")) return "patch";
  return "tee";
}

const printifyCopyOverrides: Record<
  string,
  { slug: string; name: string; description: string; price_cents?: number }
> = {
  "6a7fcaa74f40ed8f8107ca0f": {
    slug: "club-pup-tee",
    name: "Club Pup Tee",
    description:
      "The club dog is on his back. The wrench is in the grass. BROKE DADS CLUB is on the chest so another dad in the pickup line might actually nod at you. Soft Gildan cotton, printed after you check out. White, graphite heather, or military green. For dads whose best coworker still has four paws.",
    price_cents: 1999,
  },
};

function oneRetailPrice(
  variants: PrintifyVariant[],
  overridePrice?: number,
) {
  if (overridePrice && overridePrice > 0) return overridePrice;
  return Math.min(...variants.map((variant) => variant.price_cents));
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
        const price_cents = oneRetailPrice(variants, override?.price_cents);
        return {
          id: row.id,
          slug: override?.slug ?? slugify(copy.title),
          name: override?.name ?? copy.title,
          description: override?.description ?? copy.description,
          price_cents,
          category: art === "tee" || art === "hoodie" || art === "cap" ? "Apparel" : "Gear",
          art,
          image,
          images,
          active: true,
          variants: variants.map((variant) => ({ ...variant, price_cents })),
        };
      })
      .filter((product) => product !== null);
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
      return data.filter(isProduct).filter(hasProductPhoto);
    }
  }

  return seedProducts.filter((product) => product.active && hasProductPhoto(product));
}

export async function getProducts(): Promise<Product[]> {
  const [printify, local] = await Promise.all([
    getPrintifyProducts(),
    getLocalPhotoProducts(),
  ]);
  const slugs = new Set(printify.map((product) => product.slug));
  return [...printify, ...local.filter((product) => !slugs.has(product.slug))];
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
    active: true,
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
    active: true,
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
