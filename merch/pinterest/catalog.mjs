import { SITE_URL } from "./env.mjs";

/**
 * Organic pin catalog. Graphics follow the TikTok hook style:
 * brand + gold rule + big condensed line(s) + short footer.
 */
export const pins = [
  {
    id: "the-dad-tax",
    path: "/guides/the-dad-tax",
    title: "The dad tax: why kids make every bill bigger",
    description:
      "Spirit wear. Cleats. Another $40 ask. The small charges stack faster than the mortgage. Free guide for dads who want to see it coming.",
    alt: "The dad tax guide from Broke Dads Club",
    lines: ["The dad tax is", "every small ask", "you did not budget"],
    footer: "free guide · name it before it stacks",
  },
  {
    id: "grocery-week-checklist",
    path: "/resources/grocery-week-checklist",
    title: "Free $47 grocery checklist for a family of 4",
    description:
      "A one-page cart for about 3-4 people. Shop once. Cook extra Monday. Free printable.",
    alt: "Free $47 grocery week checklist",
    lines: ["$47 grocery week", "for a family of four"],
    footer: "free printable · shop once",
  },
  {
    id: "the-47-dollar-grocery-week",
    path: "/guides/the-47-dollar-grocery-week",
    title: "How to feed a family on about $50 a week",
    description:
      "A realistic week of dinners for about 3-4 people. Not a stunt list.",
    alt: "Family grocery budget under $50 a week",
    lines: ["Feed four for", "about fifty bucks"],
    footer: "free guide · real Tuesday dinners",
  },
  {
    id: "school-supply-triage",
    path: "/resources/school-supply-triage",
    title: "School supply list triage sheet (free)",
    description:
      "Must, reuse, skip. Write the cap before you enter the store.",
    alt: "Free school supply triage printable",
    lines: ["The school list", "will wreck August", "if you let it"],
    footer: "free printable · must / reuse / skip",
  },
  {
    id: "birthday-party-budget",
    path: "/resources/birthday-party-budget",
    title: "Kids birthday party budget worksheet",
    description:
      "Set the limit before the bounce house quote hits your phone.",
    alt: "Free kids birthday party budget printable",
    lines: ["Birthday parties", "are not a", "second mortgage"],
    footer: "free printable · set the limit first",
  },
  {
    id: "the-sports-signup-fee",
    path: "/guides/the-sports-signup-fee-you-didnt-budget-for",
    title: "Sports signup is only the down payment",
    description:
      "Uniforms, travel, snacks, end-of-season gear. Decide with eyes open.",
    alt: "Hidden sports costs guide for parents",
    lines: ["Sports signup is", "only the", "down payment"],
    footer: "free guide · ask what else is coming",
  },
  {
    id: "after-school-collapse",
    path: "/guides/the-after-school-collapse-is-not-a-bad-kid",
    title: "After-school meltdown is not a bad kid",
    description:
      "Angel at school, meltdown in the car. Snack first. Talk later.",
    alt: "After-school collapse guide for dads",
    lines: ["After-school collapse", "is not a bad kid"],
    footer: "free guide · empty tank, not attitude",
  },
  {
    id: "packing-school-lunch",
    path: "/guides/packing-school-lunch-without-a-guilt-spiral",
    title: "School lunch without the guilt spiral",
    description:
      "Good enough lunches that leave the house. Three rotations beat cute boxes.",
    alt: "School lunch packing guide",
    lines: ["School lunch just", "has to leave", "the house"],
    footer: "free guide · packed beats perfect",
  },
  {
    id: "gas-station-dinner",
    path: "/guides/gas-station-dinner",
    title: "When dinner is a gas station receipt",
    description:
      "Name the pattern. Stock one rescue meal. Stop pretending willpower is a plan.",
    alt: "Gas station dinner guide",
    lines: ["Gas station dinner", "is a symptom,", "not a plan"],
    footer: "free guide · stock the rescue meal",
  },
  {
    id: "explaining-we-cant-go",
    path: "/guides/explaining-we-cant-go",
    title: "How to tell kids we cannot go",
    description:
      "Short, calm scripts when the answer is no. No shame spiral required.",
    alt: "Scripts for telling kids we cannot go",
    lines: ["We cannot go", "is a complete", "sentence"],
    footer: "free guide · calm no, smaller yes",
  },
  {
    id: "one-nfl-game",
    path: "/guides/one-nfl-game-for-four-is-a-second-vacation",
    title: "One NFL game for four is a second vacation",
    description:
      "About $1,475 for a family of four before merch. Price the day. Pick yes or no out loud.",
    alt: "NFL game cost guide for families",
    lines: ["One NFL game for four", "is a second vacation"],
    footer: "free guide · the real Sunday math",
  },
].map((pin) => ({
  ...pin,
  headline: (pin.lines || []).join(" "),
  link: `${SITE_URL}${pin.path}`,
}));
