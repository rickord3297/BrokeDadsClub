export type Resource = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  printLabel: string;
  guideSlug: string;
  guideLabel: string;
};

export const resources: Resource[] = [
  {
    slug: "grocery-week-checklist",
    title: "The $47 grocery-week checklist",
    seoTitle: "Free $47 Grocery Week Checklist",
    description:
      "Printable grocery-week checklist for feeding about 3-4 people on a tight budget. Realistic cart amounts, a tired-night pasta, and three rules that keep the second trip from happening.",
    excerpt:
      "A week of dinners for about 3-4 people. Dozen eggs, a pack of thighs, pasta on the tired night. Shop once.",
    printLabel: "Print or save PDF",
    guideSlug: "the-47-dollar-grocery-week",
    guideLabel: "the $47 grocery week",
  },
  {
    slug: "school-supply-triage",
    title: "School supply triage sheet",
    seoTitle: "Free School Supply List Triage Sheet",
    description:
      "Printable back-to-school supply triage sheet: must, reuse, and skip columns, a hard number, and scripts so August does not wreck the grocery money.",
    excerpt:
      "Three columns for the school list. Must, reuse, skip. Write the number before you enter the store.",
    printLabel: "Print or save PDF",
    guideSlug: "school-supply-list",
    guideLabel: "the school supply list that quietly wrecks August",
  },
  {
    slug: "birthday-party-budget",
    title: "Birthday party budget sheet",
    seoTitle: "Free Kids Birthday Party Budget Worksheet",
    description:
      "Printable kids birthday party budget worksheet: dollar fence, kid count, hosting vs attending, and a short run-of-show so the day stays fun and solvent.",
    excerpt:
      "Pick the dollar fence and the kid count first. Then cake, one activity, done.",
    printLabel: "Print or save PDF",
    guideSlug: "birthday-party-math",
    guideLabel: "birthday party math",
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
