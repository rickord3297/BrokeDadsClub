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
    title: "Start the week with one useful thing",
    body: "One short note every Sunday at 9am Central. The guide worth using, a printable if we have one, and nothing else. Not a pile of everything you missed.",
    button: "Send it Sundays",
    success: "You're on the Sunday list. It lands at 9am Central.",
  },
} as const;
