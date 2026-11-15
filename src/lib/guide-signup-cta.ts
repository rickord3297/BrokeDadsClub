/**
 * Early grocery-list signup on guides that already attract budget intent.
 * Bottom GuideEmailCta still runs for everyone; this catches people who bounce mid-read.
 */

const GROCERY_FOCUSED_SLUGS = new Set([
  "the-47-dollar-grocery-week",
  "second-grocery-trip-blows-the-week",
  "gas-station-dinner",
  "packing-school-lunch-without-a-guilt-spiral",
  "the-basket-is-the-dinner",
  "the-dad-tax",
  "dad-math",
]);

const EXTRA_SIGNUP_SLUGS = new Set(["birthday-party-math"]);

export type GuideSignupCopy = {
  title: string;
  body: string;
  button: string;
};

/** Money guides plus a few high-intent Kids pages. */
export function guideShowsEarlySignup(guide: {
  category: string;
  slug: string;
}): boolean {
  if (guide.category === "Money") return true;
  return EXTRA_SIGNUP_SLUGS.has(guide.slug);
}

/** Tighter grocery-list copy when the guide is already about food or kid costs. */
export function guideSignupCopy(slug: string): GuideSignupCopy | null {
  if (!GROCERY_FOCUSED_SLUGS.has(slug)) return null;
  return {
    title: "Get the free $47 grocery list",
    body: "Seven dinners for about $44 at Walmart. Every item covers two nights. Then one short dad tactic every Sunday.",
    button: "Get the free list",
  };
}
