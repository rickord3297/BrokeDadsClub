export type GlossaryTerm = {
  slug: string;
  pattern: RegExp;
  hint: string;
};

/** Coined BDC phrases → foundational guides. Longer patterns first at runtime. */
export const guideGlossaryTerms: GlossaryTerm[] = [
  {
    slug: "the-47-dollar-grocery-week",
    pattern: /\$47 grocery week|\bthe \$47 grocery week\b/gi,
    hint: "One week of groceries on a hard budget",
  },
  {
    slug: "birthday-party-math",
    pattern: /\bbirthday party math\b/gi,
    hint: "Decide the story before the invitations go out",
  },
  {
    slug: "gas-station-dinner",
    pattern: /\bgas station dinner\b/gi,
    hint: "When dinner happens in aisle three",
  },
  {
    slug: "the-second-bill",
    pattern: /\bthe second bill\b|\bsecond bill\b/gi,
    hint: "School fees that hit after class starts",
  },
  {
    slug: "dad-math",
    pattern: /\bdad math\b/gi,
    hint: "Quick mental math for kid-shaped costs",
  },
  {
    slug: "the-dad-tax",
    pattern: /\bthe dad tax\b|\bdad tax\b/gi,
    hint: "Why everything costs more with kids",
  },
];

export function sortedGlossaryTerms(currentSlug?: string) {
  return guideGlossaryTerms
    .filter((term) => term.slug !== currentSlug)
    .sort((a, b) => b.pattern.source.length - a.pattern.source.length);
}
