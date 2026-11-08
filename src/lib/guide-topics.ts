/** Client-safe topic route map (no filesystem). */

export const GUIDE_TOPIC_SLUGS = [
  "money",
  "time",
  "kids",
  "gear",
  "work",
] as const;

export type GuideTopicSlug = (typeof GUIDE_TOPIC_SLUGS)[number];

export const GUIDE_TOPIC_BY_CATEGORY: Record<string, GuideTopicSlug> = {
  Money: "money",
  Time: "time",
  Kids: "kids",
  Gear: "gear",
  Work: "work",
};

export function topicSlugForCategory(category: string): GuideTopicSlug | null {
  return GUIDE_TOPIC_BY_CATEGORY[category] ?? null;
}

export function guideCategoryPath(category: string): string {
  const slug = topicSlugForCategory(category);
  if (slug) return `/guides/${slug}`;
  return `/guides?topic=${encodeURIComponent(category)}`;
}
