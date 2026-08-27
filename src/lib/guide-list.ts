export type GuideListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  takeaways: string[];
  resourceSlug?: string;
  resourceTitle?: string;
  shopSlug?: string;
  shopLabel?: string;
};

/** @deprecated Use GuideListItem */
export type HomeGuide = GuideListItem;

export function filterGuidesList(
  guides: GuideListItem[],
  topic: string,
  query = "",
) {
  const hay = query.trim().toLowerCase();
  return guides.filter((guide) => {
    const topicOk = !topic || guide.category === topic;
    if (!topicOk) return false;
    if (!hay) return true;
    return (
      guide.title.toLowerCase().includes(hay) ||
      guide.excerpt.toLowerCase().includes(hay) ||
      guide.category.toLowerCase().includes(hay)
    );
  });
}

export function splitLatestGuide<T extends { slug: string }>(guides: T[]) {
  const latest = guides[0] ?? null;
  const rest = latest ? guides.filter((guide) => guide.slug !== latest.slug) : [];
  return { latest, rest };
}

export function guidesForSlugs(
  guides: GuideListItem[],
  slugs: string[],
): GuideListItem[] {
  return slugs.flatMap((slug) => {
    const guide = guides.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });
}
