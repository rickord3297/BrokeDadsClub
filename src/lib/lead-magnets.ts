import { getResource, type Resource } from "@/lib/resources";

/**
 * Standalone lead magnets for Pinterest / TikTok / IG.
 * Landing URLs live at /free/[slug] and unlock the printable after email signup.
 * Full printables stay ungated at /resources/[slug] for SEO and returning dads.
 */
export type LeadMagnet = {
  slug: string;
  resourceSlug: string;
  /** Pin / ad headline: specific promise beats "join the newsletter". */
  promise: string;
  seoTitle: string;
  description: string;
  heroLine: string;
  bullets: string[];
  ctaLabel: string;
  successMessage: string;
  successLinkLabel: string;
  pinTitle: string;
  pinDescription: string;
  pinLines: string[];
  pinFooter: string;
};

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "grocery-week-checklist",
    resourceSlug: "grocery-week-checklist",
    promise: "Free dad grocery template",
    seoTitle: "Free Dad Grocery Template ($47 Week Checklist)",
    description:
      "Get the free one-page $47 grocery-week checklist for dads. Shop once, cook extra Monday, name one snack. Email signup unlocks the printable PDF.",
    heroLine: "A one-page cart for about 3-4 people. Print it. Take it to the store.",
    bullets: [
      "Protein, starch, produce, and pantry targets around $47",
      "Swap box for markdowns without a second trip",
      "Fill on your phone or save as PDF after signup",
    ],
    ctaLabel: "Send me the template",
    successMessage: "You're in. Open the checklist and print or save as PDF.",
    successLinkLabel: "Open free grocery template",
    pinTitle: "Free dad grocery template ($47 week)",
    pinDescription:
      "One-page $47 grocery checklist for a family of 3-4. Shop once. Cook extra Monday. Free printable for dads.",
    pinLines: ["Free dad", "grocery template"],
    pinFooter: "free printable · email unlock",
  },
  {
    slug: "trunk-dinner-kit",
    resourceSlug: "trunk-dinner-kit",
    promise: "Free trunk dinner kit checklist",
    seoTitle: "Free Trunk Dinner Kit Checklist for Dads",
    description:
      "Get the free one-page trunk dinner kit checklist. Pack protein, carb, fruit, and water so gas station panic is optional. Email unlocks the printable.",
    heroLine: "A twelve-dollar bridge kit for the car. Restock on grocery day.",
    bullets: [
      "Protein, carb, fruit-ish, water, and wipes",
      "What never goes in a hot trunk",
      "Restock line tied to your weekly shop",
    ],
    ctaLabel: "Send me the kit checklist",
    successMessage: "You're in. Open the kit checklist and print for the glove box.",
    successLinkLabel: "Open trunk kit checklist",
    pinTitle: "Free trunk dinner kit checklist",
    pinDescription:
      "One-page car dinner kit so gas station panic is optional. Free printable for dads.",
    pinLines: ["Trunk dinner kit", "beats gas station", "panic"],
    pinFooter: "free printable · pack once",
  },
];

export function getLeadMagnet(slug: string) {
  return leadMagnets.find((magnet) => magnet.slug === slug) ?? null;
}

export function requireLeadMagnet(slug: string) {
  const magnet = getLeadMagnet(slug);
  if (!magnet) {
    throw new Error(`Unknown lead magnet: ${slug}`);
  }
  return magnet;
}

export function leadMagnetResource(magnet: LeadMagnet): Resource {
  const resource = getResource(magnet.resourceSlug);
  if (!resource) {
    throw new Error(`Lead magnet missing resource: ${magnet.resourceSlug}`);
  }
  return resource;
}
