import { SITE_URL } from "./env.mjs";

/**
 * Organic pin catalog. Keep titles under 100 chars, descriptions under 800.
 * Graphic copy (headline / sub / bullets) should read like a save-worthy tip,
 * not internal product jargon.
 */
export const pins = [
  {
    id: "grocery-week-checklist",
    path: "/resources/grocery-week-checklist",
    title: "Free $47 grocery checklist for a family of 4",
    description:
      "A one-page cart that keeps dinner under about $47 for 3-4 people. Shop once, cook extra Monday, name one snack. Free printable for dads.",
    alt: "Free $47 grocery week checklist from Broke Dads Club",
    kicker: "Free printable",
    headline: "$47 grocery week",
    sub: "A cart that survives a real Tuesday",
    bullets: [
      "Shop one store, one trip",
      "Cook extra on Monday",
      "Buy one planned snack",
    ],
  },
  {
    id: "the-47-dollar-grocery-week",
    path: "/guides/the-47-dollar-grocery-week",
    title: "How to feed a family on about $50 a week",
    description:
      "Not a stunt list. A realistic week of dinners for about 3-4 people: thighs, eggs, leftover tacos, pasta on the tired night.",
    alt: "Family grocery budget guide under $50 a week",
    kicker: "Free guide",
    headline: "Feed 4 for ~$50",
    sub: "The week that does not need a second store",
    bullets: [
      "Thighs, eggs, beans, pasta",
      "Leftovers get a new name",
      "Skip the impulse aisle",
    ],
  },
  {
    id: "the-dad-tax",
    path: "/guides/the-dad-tax",
    title: "The dad tax: why kids make every bill bigger",
    description:
      "Spirit wear. Cleats. Another $40 ask. The small charges stack faster than the mortgage. Here is how to see them coming without turning into a miser.",
    alt: "Broke Dads Club guide to the dad tax",
    kicker: "Free guide",
    headline: "The dad tax",
    sub: "The small kid costs that keep stacking",
    bullets: [
      "Decide your yeses ahead of time",
      "Keep a small chaos money fund",
      "Have one calm line for no",
    ],
  },
  {
    id: "school-supply-triage",
    path: "/resources/school-supply-triage",
    title: "School supply list triage sheet (free)",
    description:
      "Must, reuse, skip. Write the budget cap before you walk into the store so August does not wreck grocery money.",
    alt: "Free school supply triage printable",
    kicker: "Free printable",
    headline: "School supply triage",
    sub: "Before August wrecks the grocery money",
    bullets: [
      "List what you already own",
      "Sort must, reuse, skip",
      "Write the spending cap first",
    ],
  },
  {
    id: "birthday-party-budget",
    path: "/resources/birthday-party-budget",
    title: "Kids birthday party budget worksheet",
    description:
      "Set the limit, count the kids, pick free or low-cost options so the day stays fun and solvent.",
    alt: "Free kids birthday party budget printable",
    kicker: "Free printable",
    headline: "Birthday party math",
    sub: "Fun without the bounce-house bill",
    bullets: [
      "Set the spending limit first",
      "Count guests before cake math",
      "Park parties beat venues",
    ],
  },
  {
    id: "the-sports-signup-fee",
    path: "/guides/the-sports-signup-fee-you-didnt-budget-for",
    title: "Sports signup is only the down payment",
    description:
      "Uniforms, travel, snacks, end-of-season gear. Decide with eyes open before you hit pay.",
    alt: "Guide to hidden sports costs for parents",
    kicker: "Free guide",
    headline: "Sports signup fee",
    sub: "That number is only the down payment",
    bullets: [
      "Ask what else is coming",
      "Check for aid or scholarships",
      "One paid yes per season",
    ],
  },
  {
    id: "after-school-collapse",
    path: "/guides/the-after-school-collapse-is-not-a-bad-kid",
    title: "After-school meltdown is not a bad kid",
    description:
      "Angel at school, meltdown in the car. Snack first, quiet ten minutes, talk later.",
    alt: "After-school collapse guide for dads",
    kicker: "Free guide",
    headline: "After-school collapse",
    sub: "Empty tank, not a bad kid",
    bullets: [
      "Snack before the lecture",
      "Quiet for ten minutes",
      "Save the talk for later",
    ],
  },
  {
    id: "packing-school-lunch",
    path: "/guides/packing-school-lunch-without-a-guilt-spiral",
    title: "School lunch without the guilt spiral",
    description:
      "Good enough lunches that leave the house. Three rotations beat cute Pinterest boxes.",
    alt: "School lunch packing guide for busy dads",
    kicker: "Free guide",
    headline: "School lunch",
    sub: "It just has to leave the house",
    bullets: [
      "Keep three easy rotations",
      "Skip the cute lunch art",
      "Packed beats perfect",
    ],
  },
  {
    id: "gas-station-dinner",
    path: "/guides/gas-station-dinner",
    title: "When dinner is a gas station receipt",
    description:
      "Name the pattern, stock one rescue meal, stop pretending willpower is a plan.",
    alt: "Gas station dinner guide for tired parents",
    kicker: "Free guide",
    headline: "Gas station dinner",
    sub: "When the day already won",
    bullets: [
      "Stock one rescue meal",
      "Count the small charges",
      "Fix the week upstream",
    ],
  },
  {
    id: "explaining-we-cant-go",
    path: "/guides/explaining-we-cant-go",
    title: "How to tell kids we cannot go",
    description:
      "Short, calm scripts when the answer is no. Honest without a shame spiral or a TED Talk about inflation.",
    alt: "Scripts for telling kids we cannot afford something",
    kicker: "Free guide",
    headline: "We cannot go",
    sub: "A calm no that still feels like parenting",
    bullets: [
      "Keep the sentence short",
      "Offer a real smaller yes",
      "Skip the shame spiral",
    ],
  },
].map((pin) => ({
  ...pin,
  link: `${SITE_URL}${pin.path}`,
}));
