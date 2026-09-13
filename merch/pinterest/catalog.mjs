import { SITE_URL } from "./env.mjs";

/**
 * Organic pin catalog. Keep titles under 100 chars, descriptions under 800.
 * Images are generated from headline/sub/bullets in render.mjs
 */
export const pins = [
  {
    id: "grocery-week-checklist",
    path: "/resources/grocery-week-checklist",
    title: "Free $47 grocery-week checklist for dads",
    description:
      "Printable cart targets for about 3-4 people: protein, starch, produce, pantry, and a swap box. Shop once. Cook extra Monday. Free download.",
    alt: "Broke Dads Club grocery week checklist printable",
    headline: "$47 grocery week",
    sub: "Free printable checklist",
    bullets: ["Shop once", "Cook extra Monday", "Name one snack"],
  },
  {
    id: "the-47-dollar-grocery-week",
    path: "/guides/the-47-dollar-grocery-week",
    title: "Family grocery budget under $50 a week",
    description:
      "A realistic cart and dinners for about 3-4 people. Not a stunt list. Thighs, eggs, pasta on the tired night, leftover tacos Tuesday.",
    alt: "Broke Dads Club $47 grocery week guide",
    headline: "Under $50 grocery week",
    sub: "Real cart. Real Tuesday.",
    bullets: ["Dozen eggs", "Family-pack thighs", "Pasta night saved"],
  },
  {
    id: "the-dad-tax",
    path: "/guides/the-dad-tax",
    title: "The dad tax: why everything costs more with kids",
    description:
      "Food, time, convenience, and social pressure multiply. Name the tax so you can plan for it. Yes-list, sinking fund, one calm script.",
    alt: "Broke Dads Club dad tax guide",
    headline: "The dad tax",
    sub: "Kids multiply every bill",
    bullets: ["Yes-list", "Ugly-name fund", "Not in our plan"],
  },
  {
    id: "school-supply-triage",
    path: "/resources/school-supply-triage",
    title: "School supply triage sheet (free printable)",
    description:
      "Must / reuse / skip columns plus a budget cap so August does not wreck grocery money. Free printable for dads.",
    alt: "Broke Dads Club school supply triage printable",
    headline: "School supply triage",
    sub: "Must · Reuse · Skip",
    bullets: ["Write the cap first", "Inventory what you own", "Skip the rest"],
  },
  {
    id: "birthday-party-budget",
    path: "/resources/birthday-party-budget",
    title: "Kids birthday party budget worksheet",
    description:
      "Spending limit, guest count, per-kid max, and free alternatives so the day stays fun and solvent. Free printable.",
    alt: "Broke Dads Club birthday party budget printable",
    headline: "Birthday party math",
    sub: "Fun without the bounce-house bill",
    bullets: ["Set the limit", "Count the kids", "Park > venue"],
  },
  {
    id: "the-sports-signup-fee",
    path: "/guides/the-sports-signup-fee-you-didnt-budget-for",
    title: "The sports signup fee you did not budget for",
    description:
      "Signup is the down payment. Uniforms, travel, snacks, and end-of-season gear come next. Decide with eyes open.",
    alt: "Broke Dads Club sports signup fee guide",
    headline: "Sports signup fee",
    sub: "That is the down payment",
    bullets: ["Name the second wave", "Ask about aid", "One yes per season"],
  },
  {
    id: "after-school-collapse",
    path: "/guides/the-after-school-collapse-is-not-a-bad-kid",
    title: "After-school collapse is not a bad kid",
    description:
      "Angel at school, meltdown in the car. Scripts and a decompression routine that survive a real Tuesday pickup.",
    alt: "Broke Dads Club after-school collapse guide",
    headline: "After-school collapse",
    sub: "Not a bad kid. Empty tank.",
    bullets: ["Snack first", "Quiet ten minutes", "Talk later"],
  },
  {
    id: "packing-school-lunch",
    path: "/guides/packing-school-lunch-without-a-guilt-spiral",
    title: "Packing school lunch without a guilt spiral",
    description:
      "Good enough lunches that leave the house. Rotation, not Pinterest perfection. For dads doing the morning pack.",
    alt: "Broke Dads Club school lunch guide",
    headline: "School lunch",
    sub: "Without the guilt spiral",
    bullets: ["Three rotations", "Skip cute", "It left the house"],
  },
  {
    id: "gas-station-dinner",
    path: "/guides/gas-station-dinner",
    title: "Gas station dinner nights (and how to cut them)",
    description:
      "When the day wins and dinner is a receipt. Name the pattern, stock the rescue meal, stop pretending willpower is a plan.",
    alt: "Broke Dads Club gas station dinner guide",
    headline: "Gas station dinner",
    sub: "When the day wins",
    bullets: ["Rescue meal on shelf", "Count the charges", "Fix upstream"],
  },
  {
    id: "explaining-we-cant-go",
    path: "/guides/explaining-we-cant-go",
    title: "How to tell kids we cannot go (without a shame spiral)",
    description:
      "Calm scripts when the answer is no. Honest, short, and not a TED Talk about inflation.",
    alt: "Broke Dads Club explaining we cannot go guide",
    headline: "We cannot go",
    sub: "A complete sentence",
    bullets: ["Short script", "Offer the yes", "No shame spiral"],
  },
].map((pin) => ({
  ...pin,
  link: `${SITE_URL}${pin.path}`,
}));
