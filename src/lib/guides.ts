import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { site } from "@/lib/site";

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
  faq: GuideFaq[];
  related: string[];
  shop: string[];
  nextGuide?: string;
  content: string;
};

const guidesDir = path.join(process.cwd(), "content/guides");

function parseStatus(value: unknown): GuideStatus {
  if (value === "draft" || value === "scheduled" || value === "published") {
    return value;
  }
  return "published";
}

function parseKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseFaq(value: unknown): GuideFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.question !== "string" || typeof row.answer !== "string") {
      return [];
    }
    return [{ question: row.question, answer: row.answer }];
  });
}

function isLive(guide: Guide, now = new Date()): boolean {
  if (guide.status === "draft") return false;
  if (guide.status === "published") return true;
  const goLive = new Date(`${guide.publishedAt}T00:00:00.000Z`);
  return !Number.isNaN(goLive.getTime()) && now.getTime() >= goLive.getTime();
}

function isValidGuideData(data: Record<string, unknown>, file: string): boolean {
  const required: Array<[string, unknown]> = [
    ["slug", data.slug],
    ["title", data.title],
    ["category", data.category],
    ["publishedAt", data.publishedAt],
  ];

  for (const [field, value] of required) {
    if (typeof value !== "string" || !value.trim()) {
      console.error(`Skipping invalid guide ${file}: missing ${field}`);
      return false;
    }
  }

  return true;
}

function readAllGuides(): Guide[] {
  if (!fs.existsSync(guidesDir)) return [];

  return fs
    .readdirSync(guidesDir)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      try {
        const raw = fs.readFileSync(path.join(guidesDir, file), "utf8");
        const { data, content } = matter(raw);
        if (!isValidGuideData(data as Record<string, unknown>, file)) {
          return [];
        }

        const title = data.title as string;
        const excerpt =
          typeof data.excerpt === "string" ? data.excerpt : "";
        return [
          {
            slug: data.slug as string,
            title,
            seoTitle:
              typeof data.seoTitle === "string" && data.seoTitle.length > 0
                ? data.seoTitle
                : `${title} | ${site.name}`,
            excerpt,
            description:
              typeof data.description === "string" && data.description.length > 0
                ? data.description
                : excerpt.slice(0, 155),
            category: data.category as string,
            readTime: data.readTime as string,
            publishedAt: data.publishedAt as string,
            status: parseStatus(data.status),
            keywords: parseKeywords(data.keywords),
            faq: parseFaq(data.faq),
            related: parseStringList(data.related),
            shop: parseStringList(data.shop),
            nextGuide:
              typeof data.nextGuide === "string" && data.nextGuide.length > 0
                ? data.nextGuide
                : undefined,
            content,
          },
        ];
      } catch (error) {
        console.error(`Skipping invalid guide ${file}:`, error);
        return [];
      }
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/** Public guides only (hides drafts; respects schedule dates). */
export function getGuides(): Guide[] {
  return readAllGuides().filter(
    (guide) =>
      isLive(guide) &&
      Boolean(guide.slug?.trim()) &&
      Boolean(guide.title?.trim()) &&
      Boolean(guide.category?.trim()),
  );
}

export function getGuide(slug: string): Guide | null {
  return getGuides().find((guide) => guide.slug === slug) ?? null;
}

export const START_HERE_SLUGS = [
  "the-dad-tax",
  "the-47-dollar-grocery-week",
  "school-supply-list",
  "talking-to-kids-about-money",
];

const CATEGORY_ORDER = ["Money", "Time", "Kids", "Work", "Gear"];

export function getGuideCategories(guides: Guide[] = getGuides()): string[] {
  const found = new Set(
    guides
      .map((guide) => guide.category)
      .filter((category): category is string => Boolean(category?.trim())),
  );
  return [
    ...CATEGORY_ORDER.filter((category) => found.has(category)),
    ...[...found].filter((category) => !CATEGORY_ORDER.includes(category)).sort(),
  ];
}

export function matchesGuideQuery(guide: Guide, query: string): boolean {
  const hay = query.trim().toLowerCase();
  if (!hay) return true;
  return (
    guide.title.toLowerCase().includes(hay) ||
    guide.excerpt.toLowerCase().includes(hay) ||
    guide.category.toLowerCase().includes(hay) ||
    guide.keywords.some((keyword) => keyword.toLowerCase().includes(hay))
  );
}

export function guideKeywords(guide: Guide): string[] {
  const fallback = [
    "broke dads club",
    "parenting on a budget",
    `${guide.category.toLowerCase()} tips for dads`,
    guide.title.toLowerCase(),
  ];
  return [...new Set([...guide.keywords, ...fallback])];
}

export function getGuidesSince(sinceIsoDate: string): Guide[] {
  const since = new Date(`${sinceIsoDate}T00:00:00.000Z`);
  if (Number.isNaN(since.getTime())) return [];
  return getGuides().filter((guide) => {
    const published = new Date(`${guide.publishedAt}T00:00:00.000Z`);
    return !Number.isNaN(published.getTime()) && published.getTime() >= since.getTime();
  });
}

export function getRelatedGuides(guide: Guide, limit = 3): Guide[] {
  const all = getGuides().filter((item) => item.slug !== guide.slug);
  const preferred = guide.related
    .map((slug) => all.find((item) => item.slug === slug))
    .filter((item): item is Guide => item != null);
  if (preferred.length >= limit) return preferred.slice(0, limit);

  const sameCategory = all.filter(
    (item) =>
      item.category === guide.category &&
      !preferred.some((picked) => picked.slug === item.slug),
  );
  return [...preferred, ...sameCategory, ...all].slice(0, limit);
}

/** Split markdown after the first section so we can inject a mid-article CTA. */
export function splitGuideContent(content: string): [string, string] {
  const matches = [...content.matchAll(/^## /gm)];
  if (matches.length >= 2 && matches[1].index != null) {
    const idx = matches[1].index;
    return [content.slice(0, idx).trimEnd(), content.slice(idx).trimStart()];
  }
  const mid = Math.floor(content.length / 2);
  const breakAt = content.indexOf("\n\n", mid);
  if (breakAt === -1) return [content, ""];
  return [content.slice(0, breakAt).trimEnd(), content.slice(breakAt).trimStart()];
}
