/** Client-safe guide filtering (no filesystem imports). */

export type GuideSearchFields = {
  title: string;
  excerpt: string;
  category: string;
  keywords?: string[];
};

export function matchesGuideQuery(
  guide: GuideSearchFields,
  query: string,
): boolean {
  const hay = query.trim().toLowerCase();
  if (!hay) return true;
  const keywords = guide.keywords ?? [];
  return (
    guide.title.toLowerCase().includes(hay) ||
    guide.excerpt.toLowerCase().includes(hay) ||
    guide.category.toLowerCase().includes(hay) ||
    keywords.some((keyword) => keyword.toLowerCase().includes(hay))
  );
}

export function filterGuidesList<T extends GuideSearchFields>(
  guides: T[],
  topic: string,
  query = "",
) {
  return guides.filter((guide) => {
    if (topic && guide.category !== topic) return false;
    return matchesGuideQuery(guide, query);
  });
}
