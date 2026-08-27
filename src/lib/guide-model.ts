/** Shared guide shapes and helpers safe for client components. */

export type GuideStatus = "draft" | "scheduled" | "published";

export type GuideFaq = {
  question: string;
  answer: string;
};

export type Guide = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  status: GuideStatus;
  keywords: string[];
  takeaways: string[];
  /** Immediate 5-minute win shown under the intro. */
  action: string;
  faq: GuideFaq[];
  related: string[];
  shop: string[];
  /** Optional next guide for post-signup / end-of-article CTAs. */
  nextGuide?: string;
  content: string;
};

/** Card / explorer payload derived from a Guide. */
export type GuideListItem = Pick<
  Guide,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "readTime"
  | "publishedAt"
  | "takeaways"
  | "keywords"
> & {
  resourceTieIn?: {
    href: string;
    label: string;
  } | null;
};

export function toGuideListItem(
  guide: Guide,
  resourceTieIn?: GuideListItem["resourceTieIn"],
): GuideListItem {
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    category: guide.category,
    readTime: guide.readTime,
    publishedAt: guide.publishedAt,
    takeaways: guide.takeaways.slice(0, 2),
    keywords: guide.keywords,
    resourceTieIn: resourceTieIn ?? null,
  };
}

export type GuideHeading = {
  id: string;
  text: string;
};

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** H2 jump targets for longer guides. */
export function extractGuideHeadings(content: string): GuideHeading[] {
  const headings: GuideHeading[] = [];
  const used = new Set<string>();
  for (const match of content.matchAll(/^## (.+)$/gm)) {
    const text = match[1].trim();
    if (!text) continue;
    let id = slugifyHeading(text) || "section";
    if (used.has(id)) {
      let n = 2;
      while (used.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }
    used.add(id);
    headings.push({ id, text });
  }
  return headings;
}

export function parseReadMinutes(readTime: string): number {
  const match = readTime.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

/** Split intro (before first H2) from the rest of the body. */
export function splitGuideIntro(content: string): [string, string] {
  const match = content.match(/^## /m);
  if (!match || match.index == null) return [content.trim(), ""];
  return [
    content.slice(0, match.index).trimEnd(),
    content.slice(match.index).trimStart(),
  ];
}
