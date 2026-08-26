export const site = {
  name: "Broke Dads Club",
  shortName: "BDC",
  domain: "brokedadsclub.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brokedadsclub.com",
  tagline: "Broke doesn't mean broken.",
  description:
    "Practical money guides for fathers stretching every dollar and still showing up.",
  email: "dad@brokedadsclub.com",
  weekStart: {
    kicker: "Sunday email",
    title: "The $47 grocery checklist + one weekly tactic",
    body: "Get the free grocery-week checklist, then one short dad tactic every Sunday at 9am Central. No daily spam pile.",
    button: "Send it Sundays",
    success: "You're on the Sunday list. Grab the grocery checklist while you wait.",
  },
} as const;
