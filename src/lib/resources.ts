export type Resource = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  intro: string;
  printLabel: string;
  guideSlug: string;
  guideLabel: string;
  keywords: string[];
};

export const resources: Resource[] = [
  {
    slug: "grocery-week-checklist",
    title: "The $47 grocery-week checklist",
    seoTitle: "Free $47 Family Grocery Budget Checklist (Printable)",
    description:
      "Free printable family grocery budget checklist for about $47 a week: protein, starch, produce, pantry targets, and a swap box for store markdowns. No email required.",
    excerpt:
      "A week of dinners for about 3-4 people. Dozen eggs, a pack of thighs, pasta on the tired night. Shop once.",
    intro:
      "Print this before you walk into the store. Category targets keep the cart honest. The swap box lets you take a markdown without blowing the week. Pair it with the full $47 grocery week write-up if you want the meal logic behind the list.",
    printLabel: "Print checklist",
    guideSlug: "the-47-dollar-grocery-week",
    guideLabel: "the $47 grocery week",
    keywords: [
      "family grocery budget checklist",
      "$50 a week grocery list",
      "cheap grocery list for family of 4",
      "printable grocery budget worksheet",
    ],
  },
  {
    slug: "school-supply-triage",
    title: "School supply triage sheet",
    seoTitle: "Free School Supply List Budget Triage Sheet (Printable)",
    description:
      "Free printable school supply list triage: already-own inventory, must / reuse / skip columns, and a budget cap field so August does not wreck grocery money.",
    excerpt:
      "Three columns for the school list. Must, reuse, skip. Write the number before you enter the store.",
    intro:
      "Fill the Already Own box first. Then sort the teacher list into Must, Reuse, and Skip. Write the budget cap next to the store name before you walk in. Built for the dad who does not want August to eat September.",
    printLabel: "Print triage sheet",
    guideSlug: "school-supply-list",
    guideLabel: "the school supply list that quietly wrecks August",
    keywords: [
      "school supply list on a budget",
      "back to school supply checklist printable",
      "cheap school supplies triage",
      "school supply budget worksheet",
    ],
  },
  {
    slug: "birthday-party-budget",
    title: "Birthday party budget sheet",
    seoTitle: "Free Kids Birthday Party Budget Worksheet (Printable)",
    description:
      "Free printable kids birthday party budget worksheet: spending limit, guest count, per-kid max, and free or low-cost alternatives so the day stays fun and solvent.",
    excerpt:
      "Pick the spending limit and the kid count first. Then cake, one activity, done.",
    intro:
      "Set the spending limit and the kid count first. The sheet does the per-kid math so venue and favor limits stay obvious. Use the free and low-cost list when the bounce house quote is a joke.",
    printLabel: "Print budget sheet",
    guideSlug: "birthday-party-math",
    guideLabel: "birthday party math",
    keywords: [
      "kids birthday party budget worksheet",
      "cheap birthday party planning sheet",
      "birthday party budget printable",
      "low cost kids birthday ideas worksheet",
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug) ?? null;
}

export function requireResource(slug: string) {
  const resource = getResource(slug);
  if (!resource) {
    throw new Error(`Unknown resource: ${slug}`);
  }
  return resource;
}

export function otherResources(slug: string) {
  return resources.filter((resource) => resource.slug !== slug);
}
