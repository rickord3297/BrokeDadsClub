type ProductArt = "tee" | "mug" | "cap" | "sticker" | "hoodie" | "patch";

const GARMENT_WORD =
  /\b(t-?shirts?|tee shirts?|tees?|hoodies?|sweatshirts?|crewnecks?|caps?|hats?|mugs?|stickers?|patches?|pins?)\b/gi;

const FILLER_WORD =
  /\b(unisex|softstyle|funny|cute|cool|awesome|unique|trendy|stylish|summer|winter|gift|for dads?|for men|for women|adult|premium|classic|new|hot|best|top|quality)\b/gi;

function artLabel(art: ProductArt) {
  switch (art) {
    case "hoodie":
      return "Hoodie";
    case "cap":
      return "Cap";
    case "mug":
      return "Mug";
    case "sticker":
      return "Sticker";
    case "patch":
      return "Patch";
    default:
      return "Tee";
  }
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.toUpperCase() === "BDC") return "BDC";
      if (/^[0-9]+(xl)?$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Shorten Printify SEO titles into something a dad would actually say. */
export function clubProductName(rawTitle: string, art: ProductArt): string {
  let title = stripHtml(rawTitle);
  title = title.split("|")[0]?.trim() ?? title;
  title = title.replace(/\s*[-:]\s*broke dads club.*$/i, "").trim();

  const beforeGarment = title.split(GARMENT_WORD)[0]?.trim() ?? "";
  if (beforeGarment.length >= 6) title = beforeGarment;

  title = title.replace(FILLER_WORD, " ").replace(/\s+/g, " ").trim();
  title = titleCase(title);

  const label = artLabel(art);
  if (!title) title = `Club ${label}`;
  if (!new RegExp(`\\b${label}\\b`, "i").test(title)) {
    title = `${title} ${label}`;
  }

  if (title.length > 42) {
    const withoutLabel = title.replace(new RegExp(`\\s+${label}$`, "i"), "");
    const clipped = withoutLabel.split(" ").slice(0, 4).join(" ");
    title = `${clipped} ${label}`;
  }

  return title;
}

function fabricLine(rawDescription: string, art: ProductArt): string {
  const raw = stripHtml(rawDescription).toLowerCase();
  if (art === "hoodie") {
    if (raw.includes("fleece")) return "Heavy fleece.";
    return "Heavy fleece. Kangaroo pocket for snacks.";
  }
  if (art === "tee") {
    if (raw.includes("gildan")) return "Gildan cotton.";
    if (raw.includes("cotton")) return "Soft cotton.";
    return "Soft cotton.";
  }
  if (art === "cap" && raw.includes("cotton")) return "Cotton crown.";
  return "";
}

function wearLine(art: ProductArt): string {
  switch (art) {
    case "hoodie":
      return "The one you live in from October to April.";
    case "cap":
      return "Low profile. Covers a haircut you keep meaning to get.";
    case "mug":
      return "Whatever is keeping you vertical at 6:40 a.m.";
    case "sticker":
      return "Put it on the dented bottle or the work laptop.";
    case "patch":
      return "Iron-on or sew it to the jacket that has seen every school drop-off.";
    default:
      return "Pickup-line readable. No hustle slogan.";
  }
}

/**
 * Replace Printify's generic AI listing with Broke Dads Club voice.
 * Hand-written overrides still win in products.ts.
 */
export function clubProductDescription(input: {
  name: string;
  art: ProductArt;
  rawDescription?: string;
}): string {
  const subject = input.name
    .replace(/\s+(Tee|Hoodie|Cap|Mug|Sticker|Patch)$/i, "")
    .replace(/^Broke Dads Club\s+/i, "")
    .trim();
  const opener =
    subject.length > 2
      ? `${subject}. Club merch, not a souvenir-shop caption.`
      : "Club merch, not a souvenir-shop caption.";
  const wear = wearLine(input.art);
  const fabric = fabricLine(input.rawDescription ?? "", input.art);

  if (input.art === "tee") {
    return [opener, fabric, wear].filter(Boolean).join(" ");
  }
  if (input.art === "hoodie") {
    return [opener, wear, fabric].filter(Boolean).join(" ");
  }
  return [opener, wear, fabric].filter(Boolean).join(" ");
}

export function clubProductCopy(input: {
  title: string;
  art: ProductArt;
  rawDescription?: string;
}) {
  const name = clubProductName(input.title, input.art);
  return {
    name,
    description: clubProductDescription({
      name,
      art: input.art,
      rawDescription: input.rawDescription,
    }),
  };
}
