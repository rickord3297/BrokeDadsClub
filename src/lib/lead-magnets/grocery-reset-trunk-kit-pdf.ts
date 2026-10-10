import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

/** US Letter in points. */
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 36;

const hex = (value: string): RGB => {
  const n = Number.parseInt(value.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const C = {
  paper2: hex("#f0e6d4"),
  ink: hex("#1c1915"),
  inkSoft: hex("#5c5348"),
  pine: hex("#2c5f63"),
  rust: hex("#c4683f"),
  gold: hex("#d4a84b"),
  rule: hex("#e0d3bc"),
  white: rgb(1, 1, 1),
};

const RULES = [
  ["Buy for pairs.", "Every item covers two dinners or stays on the shelf."],
  ["Shop once.", "A second trip is how $47 turns into $90."],
  ["Cook the whole pack.", "Tuesday and Thursday are leftovers with a new name."],
] as const;

const CART = [
  {
    group: "Protein",
    target: "about $19",
    items: ["Chicken thighs, bone-in, 4 lb bag", "Ground beef, 1 lb", "Eggs, 18 count", "Black beans, 2 cans"],
  },
  {
    group: "Starch",
    target: "about $11",
    items: ["Rice, 5 lb", "Russet potatoes, 5 lb", "Burrito tortillas, 8 count", "Spaghetti, 1 lb", "1 loaf bread"],
  },
  {
    group: "Produce",
    target: "about $7",
    items: ["Yellow onions, 3 lb bag", "Frozen mixed vegetables (4 bags)"],
  },
  {
    group: "Dairy and pantry",
    target: "about $7.50",
    items: ["Shredded cheddar, 16 oz", "Pasta sauce, 24 oz", "Salsa, 16 oz"],
  },
] as const;

const KIT = [
  { group: "Protein", items: ["Tuna or chicken pouches (2)", "Peanut butter crackers", "Shelf-stable milk boxes"] },
  { group: "Carb", items: ["Crackers or tortillas (zip bag)", "Instant oatmeal cups"] },
  { group: "Fruit-ish", items: ["Applesauce pouches", "Fruit cups"] },
  { group: "Basics", items: ["2 water bottles, swapped weekly", "Wipes", "Napkins, spoons, trash bag"] },
] as const;

const NEVER_IN_KIT = "Chocolate in July. Yogurt. Leftover drive-thru. Anything that needs a fridge.";

const WEEK = [
  ["Mon", "Bake the whole chicken bag. Eat half. Rice, veg."],
  ["Tue", "Leftover chicken quesadillas, cheese, salsa."],
  ["Wed", "Brown the beef. Half into spaghetti sauce."],
  ["Thu", "Saved beef + black beans over rice. Taco bowls."],
  ["Fri", "Breakfast for dinner. Eggs, potatoes, toast."],
  ["Sat", "Baked potato bar. Beans, cheese, veg."],
  ["Sun", "Fried rice. Old rice, eggs, last veg."],
] as const;

const SWAPS = [
  ["Chicken bag over $10", "2nd 18 eggs + 2 more cans of beans"],
  ["Beef over $7/lb", "Veg spaghetti, all-bean taco bowls"],
  ["Eggs over $4 for 18", "Grilled cheese and skillet potatoes"],
  ["Potatoes over $5", "Rice Friday, 2nd box of pasta Saturday"],
  ["Fresh veg high", "Frozen wins and lasts till Sunday"],
  ["Milk", "Breakfast line, not the $47"],
] as const;

const PUT_BACK =
  "Over at the register? Put back in this order: the bread, one bag of frozen veg, then the salsa. Still over? Find the items that were not on the list. Walmart prices, Oct 2026: $44.04.";

type Fonts = { display: PDFFont; stamp: PDFFont; body: PDFFont; bodyBold: PDFFont };

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(next, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(
  page: PDFPage,
  lines: string[],
  opts: { x: number; y: number; font: PDFFont; size: number; color: RGB; leading: number },
): number {
  lines.forEach((line, i) => {
    page.drawText(line, { x: opts.x, y: opts.y - i * opts.leading, font: opts.font, size: opts.size, color: opts.color });
  });
  return opts.y - lines.length * opts.leading;
}

function tracked(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color: RGB, spacing = 0.9) {
  let cursor = x;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, font, size, color });
    cursor += font.widthOfTextAtSize(char, size) + spacing;
  }
  return cursor - x;
}

function sectionHeader(page: PDFPage, fonts: Fonts, title: string, x: number, y: number, width: number, aside?: string) {
  page.drawRectangle({ x, y: y - 20, width, height: 20, color: C.pine });
  tracked(page, title, x + 8, y - 14, fonts.stamp, 10.5, C.white, 1.1);
  if (aside) {
    const size = 7.5;
    const w = fonts.body.widthOfTextAtSize(aside, size);
    page.drawText(aside, { x: x + width - 8 - w, y: y - 13.5, font: fonts.body, size, color: C.white });
  }
  return y - 30;
}

function checkbox(page: PDFPage, x: number, y: number, size = 7.5) {
  page.drawRectangle({ x, y, width: size, height: size, borderColor: C.inkSoft, borderWidth: 0.8 });
}

function blank(page: PDFPage, x: number, y: number, width: number) {
  page.drawLine({ start: { x, y }, end: { x: x + width, y }, thickness: 0.6, color: C.inkSoft });
}

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  const dir = join(process.cwd(), "src/assets/og");
  const [fraunces, oswald] = await Promise.all([
    readFile(join(dir, "Fraunces-Bold.ttf")),
    readFile(join(dir, "Oswald-Bold.ttf")),
  ]);
  doc.registerFontkit(fontkit);
  return {
    display: await doc.embedFont(fraunces, { subset: true }),
    stamp: await doc.embedFont(oswald, { subset: true }),
    body: await doc.embedFont(StandardFonts.Helvetica),
    bodyBold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
}

function drawHeader(page: PDFPage, fonts: Fonts, title: string): number {
  page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: C.pine });
  page.drawRectangle({ x: 0, y: PAGE_H - 11, width: PAGE_W, height: 3, color: C.gold });

  let y = PAGE_H - MARGIN - 6;
  tracked(page, "BROKE DADS CLUB  ·  FREE PRINTABLE", MARGIN, y, fonts.stamp, 8.5, C.rust, 1.2);
  const stamp = "ONE PAGE · PRINT AND POST";
  const stampW = stamp.length * 1.2 + fonts.stamp.widthOfTextAtSize(stamp, 8.5);
  tracked(page, stamp, PAGE_W - MARGIN - stampW, y, fonts.stamp, 8.5, C.inkSoft, 1.2);

  y -= 26;
  y = drawLines(page, wrap(title, fonts.display, 22, PAGE_W - MARGIN * 2), {
    x: MARGIN, y, font: fonts.display, size: 22, color: C.ink, leading: 25,
  });
  y = drawLines(
    page,
    wrap(
      "One shop, one cart, one bin in the trunk. Check the cart off in the store, write what you paid, and restock the trunk kit on the same trip. Seven dinners for 3-4 people at Walmart store-brand prices.",
      fonts.body, 9, PAGE_W - MARGIN * 2,
    ),
    { x: MARGIN, y: y - 3, font: fonts.body, size: 9, color: C.inkSoft, leading: 12 },
  );
  page.drawLine({ start: { x: MARGIN, y: y - 4 }, end: { x: PAGE_W - MARGIN, y: y - 4 }, thickness: 0.8, color: C.rule });
  return y - 14;
}

function drawGroceryColumn(page: PDFPage, fonts: Fonts, x: number, top: number, width: number): number {
  let y = sectionHeader(page, fonts, "THE $47 GROCERY RESET", x, top, width, "7 dinners, 3-4 people");

  RULES.forEach(([lead, rest], i) => {
    const label = `${i + 1}. ${lead}`;
    page.drawText(label, { x, y, font: fonts.bodyBold, size: 9, color: C.ink });
    const offset = fonts.bodyBold.widthOfTextAtSize(label, 9) + 3;
    page.drawText(rest, { x: x + offset, y, font: fonts.body, size: 9, color: C.inkSoft });
    y -= 13;
  });
  y -= 8;

  for (const { group, target, items } of CART) {
    page.drawRectangle({ x, y: y - 5, width, height: 17, color: C.paper2 });
    tracked(page, group.toUpperCase(), x + 6, y, fonts.stamp, 8.5, C.pine);
    const paidLabel = "Paid $";
    const paidX = x + width - 70;
    page.drawText(target, {
      x: paidX - 12 - fonts.body.widthOfTextAtSize(target, 7.5), y, font: fonts.body, size: 7.5, color: C.inkSoft,
    });
    page.drawText(paidLabel, { x: paidX, y, font: fonts.bodyBold, size: 7.5, color: C.ink });
    blank(page, paidX + fonts.bodyBold.widthOfTextAtSize(paidLabel, 7.5) + 2, y - 1, 36);
    y -= 19;
    for (const item of items) {
      checkbox(page, x + 6, y - 1, 8);
      page.drawText(item, { x: x + 20, y, font: fonts.body, size: 9.5, color: C.ink });
      y -= 14;
    }
    y -= 4;
  }

  page.drawLine({ start: { x, y: y + 2 }, end: { x: x + width, y: y + 2 }, thickness: 0.8, color: C.rule });
  y -= 12;
  page.drawText("Cart total $", { x, y, font: fonts.bodyBold, size: 9, color: C.ink });
  blank(page, x + fonts.bodyBold.widthOfTextAtSize("Cart total $", 9) + 2, y - 1, 50);
  const itemsLabel = "Items on the belt";
  const itemsX = x + 140;
  page.drawText(itemsLabel, { x: itemsX, y, font: fonts.bodyBold, size: 9, color: C.ink });
  blank(page, itemsX + fonts.bodyBold.widthOfTextAtSize(itemsLabel, 9) + 4, y - 1, 26);
  page.drawText("(14 items)", { x: x + width - fonts.body.widthOfTextAtSize("(14 items)", 7.5), y, font: fonts.body, size: 7.5, color: C.inkSoft });
  y -= 14;
  return drawLines(page, wrap(PUT_BACK, fonts.body, 7.5, width), {
    x, y, font: fonts.body, size: 7.5, color: C.inkSoft, leading: 10,
  });
}

function drawKitColumn(page: PDFPage, fonts: Fonts, x: number, top: number, width: number): number {
  let y = sectionHeader(page, fonts, "TRUNK KIT CHECKLIST", x, top, width);
  y = drawLines(page, wrap("About $12. Restock on grocery day, same trip, no extra errand.", fonts.body, 8.5, width), {
    x, y, font: fonts.body, size: 8.5, color: C.inkSoft, leading: 11,
  });
  y -= 6;

  for (const { group, items } of KIT) {
    tracked(page, group.toUpperCase(), x, y, fonts.stamp, 8.5, C.pine);
    y -= 14;
    for (const item of items) {
      checkbox(page, x, y - 1, 8);
      page.drawText(item, { x: x + 14, y, font: fonts.body, size: 9.5, color: C.ink });
      y -= 14.5;
    }
    y -= 4;
  }

  const neverLines = wrap(NEVER_IN_KIT, fonts.body, 8, width - 16);
  const boxH = 22 + neverLines.length * 10.5;
  page.drawRectangle({ x, y: y - boxH + 8, width, height: boxH, borderColor: C.rust, borderWidth: 1, color: C.white });
  tracked(page, "NEVER IN THE KIT", x + 8, y - 4, fonts.stamp, 8.5, C.rust);
  drawLines(page, neverLines, { x: x + 8, y: y - 16, font: fonts.body, size: 8, color: C.ink, leading: 10.5 });
  y -= boxH + 8;

  tracked(page, "RESTOCK LOG", x, y, fonts.stamp, 8.5, C.pine);
  y -= 14;
  for (let i = 0; i < 4; i += 1) {
    page.drawText("Date", { x, y, font: fonts.body, size: 7.5, color: C.inkSoft });
    blank(page, x + 20, y - 1, 46);
    page.drawText("Swapped", { x: x + 74, y, font: fonts.body, size: 7.5, color: C.inkSoft });
    blank(page, x + 106, y - 1, width - 106);
    y -= 15;
  }
  return y;
}

function drawWeek(page: PDFPage, fonts: Fonts, top: number): number {
  const width = PAGE_W - MARGIN * 2;
  const y = sectionHeader(page, fonts, "THE WEEK", MARGIN, top, width, "Dinners only. Breakfast and lunch run about $28 more.");
  const gap = 6;
  const colW = (width - gap * 6) / 7;
  let lowest = y;
  WEEK.forEach(([day, plan], i) => {
    const x = MARGIN + i * (colW + gap);
    page.drawText(day.toUpperCase(), { x, y, font: fonts.stamp, size: 10, color: C.rust });
    const end = drawLines(page, wrap(plan, fonts.body, 8.5, colW), {
      x, y: y - 13, font: fonts.body, size: 8.5, color: C.ink, leading: 10.5,
    });
    lowest = Math.min(lowest, end);
  });
  return lowest - 6;
}

function drawSwaps(page: PDFPage, fonts: Fonts, top: number): number {
  const width = PAGE_W - MARGIN * 2;
  const y = sectionHeader(page, fonts, "PRICE SPIKE SWAPS", MARGIN, top, width, "Make the swap in the aisle. The plan is the shape of the week.");
  const colW = (width - 18) / 2;
  SWAPS.forEach(([when, swap], i) => {
    const x = MARGIN + (i % 2) * (colW + 18);
    const rowY = y - Math.floor(i / 2) * 15;
    const label = `${when}:`;
    page.drawText(label, { x, y: rowY, font: fonts.bodyBold, size: 9, color: C.ink });
    page.drawText(swap, {
      x: x + fonts.bodyBold.widthOfTextAtSize(label, 9) + 3, y: rowY, font: fonts.body, size: 9, color: C.inkSoft,
    });
  });
  return y - Math.ceil(SWAPS.length / 2) * 15;
}

function drawFooter(page: PDFPage, fonts: Fonts) {
  const y = MARGIN - 6;
  page.drawLine({ start: { x: MARGIN, y: y + 14 }, end: { x: PAGE_W - MARGIN, y: y + 14 }, thickness: 0.8, color: C.rule });
  tracked(page, "BROKEDADSCLUB.COM", MARGIN, y, fonts.stamp, 8.5, C.pine);
  const tagline = "Broke doesn't mean broken. Full meal plan: brokedadsclub.com/guides/the-47-dollar-grocery-week";
  const size = 7.5;
  page.drawText(tagline, {
    x: PAGE_W - MARGIN - fonts.body.widthOfTextAtSize(tagline, size), y, font: fonts.body, size, color: C.inkSoft,
  });
}

export const GROCERY_RESET_TRUNK_KIT_TITLE = "The $47 Weekly Grocery Reset & Trunk Kit Checklist";

export async function buildGroceryResetTrunkKitPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(GROCERY_RESET_TRUNK_KIT_TITLE);
  doc.setAuthor("Broke Dads Club");
  doc.setSubject("A one-page grocery cart and car emergency dinner kit checklist.");
  doc.setCreator("brokedadsclub.com");
  doc.setKeywords(["grocery budget", "trunk kit", "checklist", "printable"]);

  const fonts = await loadFonts(doc);
  const page = doc.addPage([PAGE_W, PAGE_H]);

  const top = drawHeader(page, fonts, GROCERY_RESET_TRUNK_KIT_TITLE);
  const gutter = 20;
  const leftW = 316;
  const rightX = MARGIN + leftW + gutter;
  const rightW = PAGE_W - MARGIN - rightX;
  const leftEnd = drawGroceryColumn(page, fonts, MARGIN, top, leftW);
  const rightEnd = drawKitColumn(page, fonts, rightX, top, rightW);
  page.drawLine({
    start: { x: MARGIN + leftW + gutter / 2, y: top - 26 },
    end: { x: MARGIN + leftW + gutter / 2, y: Math.min(leftEnd, rightEnd) + 4 },
    thickness: 0.6,
    color: C.rule,
  });

  const weekEnd = drawWeek(page, fonts, Math.min(leftEnd, rightEnd) - 8);
  const swapsEnd = drawSwaps(page, fonts, weekEnd - 4);
  if (swapsEnd < MARGIN + 14) {
    throw new Error(`Grocery reset PDF overflows the page by ${Math.ceil(MARGIN + 14 - swapsEnd)}pt`);
  }
  drawFooter(page, fonts);

  return doc.save();
}
