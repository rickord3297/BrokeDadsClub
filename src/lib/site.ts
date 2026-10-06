const PRODUCTION_URL = "https://brokedadsclub.com";

/**
 * Canonical origin. Preview, *.vercel.app, and www hosts all collapse to the
 * apex domain so canonicals, sitemaps, and OG URLs never leak a non-production
 * host. Localhost is only honored in `next dev`.
 */
function resolveSiteUrl(raw: string | undefined): string {
  if (!raw) return PRODUCTION_URL;
  try {
    const parsed = new URL(raw);
    const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (isLocal && process.env.NODE_ENV === "development") return parsed.origin;
  } catch {
    // Malformed env value: fall through to production.
  }
  return PRODUCTION_URL;
}

export const site = {
  name: "Broke Dads Club",
  shortName: "BDC",
  domain: "brokedadsclub.com",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  tagline: "Broke doesn't mean broken.",
  description:
    "Practical money guides for fathers stretching every dollar and still showing up.",
  shareTitle: "Broke Dads Club | Practical Family Budget Systems",
  shareDescription:
    "Simple, tactical systems to run your family budget, time, and home.",
  seoTitle: "Broke Dads Club: Budget Guides for Broke Dads",
  keywords: [
    "broke dad",
    "broke dads club",
    "family budget",
    "dad budget",
    "budgeting for dads",
    "dad tax meaning",
    "frugal family",
    "grocery budget",
    "parenting on a budget",
    "family money",
    "free printables for parents",
  ],
  email: "dad@brokedadsclub.com",
  social: [
    process.env.NEXT_PUBLIC_TIKTOK_URL
      ? { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL }
      : null,
    process.env.NEXT_PUBLIC_ETSY_SHOP_URL
      ? { label: "Etsy", href: process.env.NEXT_PUBLIC_ETSY_SHOP_URL }
      : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item)),
  weekStart: {
    kicker: "Sunday email",
    title: "The $47 grocery checklist + one weekly tactic",
    body: "Get the free grocery-week checklist, then one short dad tactic every Sunday at 9am Central. No daily spam pile.",
    button: "Send it Sundays",
    success: "You're on the Sunday list. Grab the grocery checklist while you wait.",
  },
} as const;
