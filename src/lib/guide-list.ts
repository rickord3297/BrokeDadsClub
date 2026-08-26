import type { HomeGuide } from "@/components/home-guides-section";

export function filterGuidesList(
  guides: HomeGuide[],
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
