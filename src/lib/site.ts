export const site = {
  name: "Broke Dads Club",
  shortName: "BDC",
  domain: "brokedadsclub.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brokedadsclub.com",
  tagline: "Broke doesn't mean broken.",
  description:
    "Practical money tactics and dad-life guides for fathers stretching every dollar and still showing up.",
  email: "hey@brokedadsclub.com",
} as const;
