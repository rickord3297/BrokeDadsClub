import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPAREL_SIZES,
  COMFORT_COLORS_CREW,
  COMFORT_COLORS_EARTH,
  COMFORT_COLORS_HOODIE,
  HEAVYWEIGHT_VINTAGE,
  TOTE_EARTH,
} from "../../lib/palettes.mjs";
import {
  createPrintifyClient,
  loadEnv,
  publishProduct,
} from "../../lib/printify-publish.mjs";

const dir = dirname(fileURLToPath(import.meta.url));
const artPath = join(dir, "../basic-tees/06-crest-logo/print.png");

const env = loadEnv();
const token = env.PRINTIFY_API_TOKEN;
const shopId = env.PRINTIFY_SHOP_ID;
if (!token || !shopId) throw new Error("Printify env is missing.");

const printify = createPrintifyClient(token);

const products = [
  {
    key: "vintage-tee",
    slug: "club-crest-vintage-tee",
    title: "Club Crest Vintage Tee",
    description:
      "The official Broke Dads Club crest on a garment-dyed Comfort Colors tee. Washed earth tones, soft 6.1 oz cotton, and a fit that already looks broken in. Pepper, moss, bay, terracotta, and the rest of the dad palette.",
    tags: ["broke dads club", "comfort colors", "vintage tee", "crest", "earth tones"],
    blueprintId: 706,
    printProviderId: 99,
    colors: COMFORT_COLORS_EARTH,
    sizes: APPAREL_SIZES,
    priceCents: 2999,
    placement: { position: "front", x: 0.5, y: 0.42, scale: 0.52 },
  },
  {
    key: "heavy-tee",
    slug: "club-crest-heavy-tee",
    title: "Club Crest Heavy Tee",
    description:
      "The official crest on a 7.5 oz heavyweight tee with a boxy drape. Vintage navy, hunter green, cocoa, and washed heather tones. Built for dads who wear the same shirt three days in a row.",
    tags: ["broke dads club", "heavyweight tee", "boxy tee", "crest"],
    blueprintId: 3035,
    printProviderId: 74,
    colors: HEAVYWEIGHT_VINTAGE,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    priceCents: 3299,
    placement: { position: "front", x: 0.5, y: 0.44, scale: 0.5 },
  },
  {
    key: "hoodie",
    slug: "club-crest-hoodie",
    title: "Club Crest Hoodie",
    description:
      "Garment-dyed Comfort Colors hoodie with the official crest up front. Heavy fleece, kangaroo pocket for snacks, and washed pepper, denim, and blue spruce tones. The one you live in from October to April.",
    tags: ["broke dads club", "hoodie", "comfort colors", "crest", "fleece"],
    blueprintId: 1298,
    printProviderId: 39,
    colors: COMFORT_COLORS_HOODIE,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    priceCents: 5499,
    placement: { position: "front", x: 0.5, y: 0.38, scale: 0.48 },
  },
  {
    key: "crewneck",
    slug: "club-crest-crewneck",
    title: "Club Crest Crewneck",
    description:
      "Garment-dyed Comfort Colors crewneck with the official crest. Lighter than a hoodie, still fleece-lined enough for the school run. Pepper, terracotta, chambray, and washed navy.",
    tags: ["broke dads club", "crewneck", "sweatshirt", "comfort colors", "crest"],
    blueprintId: 1296,
    printProviderId: 99,
    colors: COMFORT_COLORS_CREW,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    priceCents: 4799,
    placement: { position: "front", x: 0.5, y: 0.4, scale: 0.5 },
  },
  {
    key: "tote",
    slug: "club-crest-tote",
    title: "Club Crest Tote",
    description:
      "Canvas tote with the official crest. Camel, khaki, and coal earth tones for groceries, library books, and the stuff your pockets gave up on. One size, no excuses.",
    tags: ["broke dads club", "tote bag", "canvas tote", "crest"],
    blueprintId: 553,
    printProviderId: 217,
    colors: TOTE_EARTH,
    sizes: null,
    priceCents: 2499,
    placement: { position: "front", x: 0.5, y: 0.52, scale: 0.42 },
  },
];

const only = process.argv[2];
const toRun = only ? products.filter((p) => p.key === only) : products;
if (!toRun.length) {
  throw new Error(`Unknown product key "${only}". Use: ${products.map((p) => p.key).join(", ")}`);
}

const results = {};
for (const config of toRun) {
  console.log("\n==========", config.key, "==========\n");
  results[config.key] = await publishProduct({
    printify,
    shopId,
    printPath: artPath,
    uploadFileName: `${config.slug}.png`,
    slug: config.slug,
    title: config.title,
    description: config.description,
    tags: config.tags,
    blueprintId: config.blueprintId,
    printProviderId: config.printProviderId,
    colors: config.colors,
    sizes: config.sizes,
    priceCents: config.priceCents,
    placement: config.placement,
    resultPath: join(dir, `${config.key}-printify-result.json`),
  });
}

writeFileSync(join(dir, "publish-summary.json"), JSON.stringify(results, null, 2));
