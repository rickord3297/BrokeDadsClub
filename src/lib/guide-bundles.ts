export type GuideBundle = {
  id: string;
  title: string;
  description: string;
  slugs: string[];
};

export const GUIDE_BUNDLES: GuideBundle[] = [
  {
    id: "start-here",
    title: "Start here",
    description: "Four guides that pay rent before the rest of the library.",
    slugs: [
      "the-dad-tax",
      "the-47-dollar-grocery-week",
      "school-supply-list",
      "talking-to-kids-about-money",
    ],
  },
  {
    id: "back-to-school",
    title: "Back-to-school survival",
    description: "Supplies, fees, and sports signup before September wins.",
    slugs: [
      "school-supply-list",
      "the-second-bill",
      "the-sports-signup-fee-you-didnt-budget-for",
    ],
  },
  {
    id: "tight-month",
    title: "Top 3 for tight months",
    description: "When the math is loud and everything costs more.",
    slugs: [
      "the-dad-tax",
      "the-47-dollar-grocery-week",
      "explaining-we-cant-go",
    ],
  },
];
