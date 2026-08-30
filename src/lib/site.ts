export const site = {
  name: "Broke Dads Club",
  shortName: "BDC",
  domain: "brokedadsclub.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brokedadsclub.com",
  tagline: "Broke doesn't mean broken.",
  description:
    "Practical money guides for fathers stretching every dollar and still showing up.",
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
