import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { site } from "@/lib/site";
import {
  effectiveUpdatedAt,
  estimateReadTime,
  type Guide,
  type GuideFaq,
  type GuideListItem,
  type GuideProductCtaConfig,
  type GuideStatus,
} from "@/lib/guide-model";
import { compareGuidesForBrowse } from "@/lib/guide-season";

export type {
  Guide,
  GuideFaq,
  GuideHeading,
  GuideListItem,
  GuideStatus,
} from "@/lib/guide-model";
export {
  effectiveUpdatedAt,
  estimateReadTime,
  extractGuideHeadings,
  guideCardSubtitle,
  parseReadMinutes,
  slugifyHeading,
  splitGuideIntro,
  toGuideListItem,
} from "@/lib/guide-model";
export { filterGuidesList, matchesGuideQuery } from "@/lib/guide-query";
export {
  compareGuidesForBrowse,
  partitionGuidesForBrowse,
  seasonStatusForSlug,
} from "@/lib/guide-season";

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

function parseProductCta(value: unknown): GuideProductCtaConfig | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  if (
    typeof row.slug !== "string" ||
    typeof row.headline !== "string" ||
    typeof row.description !== "string"
  ) {
    return undefined;
  }
  return {
    slug: row.slug,
    headline: row.headline,
    description: row.description,
    badge: typeof row.badge === "string" ? row.badge : undefined,
  };
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
            readTime: estimateReadTime(content),
            publishedAt: data.publishedAt as string,
            updatedAt: effectiveUpdatedAt(
              data.publishedAt as string,
              typeof data.updatedAt === "string" ? data.updatedAt : null,
            ),
            status: parseStatus(data.status),
            keywords: parseKeywords(data.keywords),
            takeaways: parseStringList(data.takeaways).slice(0, 2),
            action:
              typeof data.action === "string" && data.action.trim()
                ? data.action.trim()
                : parseStringList(data.takeaways)[0] ?? "",
            faq: parseFaq(data.faq),
            related: parseStringList(data.related).filter(
              (item) => item !== (data.slug as string),
            ),
            shop: parseStringList(data.shop),
            productCta: parseProductCta(data.productCta),
            nextGuide:
              typeof data.nextGuide === "string" && data.nextGuide.length > 0
                ? data.nextGuide
                : undefined,
            priceYear:
              typeof data.priceYear === "number" && Number.isFinite(data.priceYear)
                ? data.priceYear
                : typeof data.priceYear === "string" && /^\d{4}$/.test(data.priceYear)
                  ? Number(data.priceYear)
                  : undefined,
            priceRefreshBy:
              typeof data.priceRefreshBy === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(data.priceRefreshBy.trim())
                ? data.priceRefreshBy.trim()
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

/** Same live set, ranked for /guides and homepage “what matters now.” */
export function getGuidesForBrowse(now = new Date()): Guide[] {
  return [...getGuides()].sort((a, b) => compareGuidesForBrowse(a, b, now));
}

export function getGuide(slug: string): Guide | null {
  return getGuides().find((guide) => guide.slug === slug) ?? null;
}

export const START_HERE_SLUGS = [
  "the-dad-tax",
  "the-47-dollar-grocery-week",
  "school-supply-list",
  "talking-to-kids-about-money",
] as const;

const CATEGORY_ORDER = ["Money", "Time", "Kids", "Work", "Gear"];

/** Hide sparse topic chips until the category has enough guides to feel like a shelf. */
export const MIN_CATEGORY_FILTER_COUNT = 3;

export function getGuideCategories(
  guides: Guide[] = getGuides(),
  options: { minCount?: number } = {},
): string[] {
  const minCount = options.minCount ?? 0;
  const counts = new Map<string, number>();
  for (const guide of guides) {
    const category = guide.category?.trim();
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  const found = [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .map(([category]) => category);
  const foundSet = new Set(found);
  return [
    ...CATEGORY_ORDER.filter((category) => foundSet.has(category)),
    ...found.filter((category) => !CATEGORY_ORDER.includes(category)).sort(),
  ];
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

/** Prefer same-category peers so Keep Going reinforces the topic hub. */
export function getRelatedGuides(guide: Guide, limit = 6): Guide[] {
  const all = getGuides().filter((item) => item.slug !== guide.slug);
  const preferred = guide.related
    .map((slug) => all.find((item) => item.slug === slug))
    .filter((item): item is Guide => item != null);

  const sameCategory = all.filter(
    (item) =>
      item.category === guide.category &&
      !preferred.some((picked) => picked.slug === item.slug),
  );
  const preferredSame = preferred.filter(
    (item) => item.category === guide.category,
  );
  const preferredOther = preferred.filter(
    (item) => item.category !== guide.category,
  );
  return [...preferredSame, ...sameCategory, ...preferredOther, ...all].slice(
    0,
    limit,
  );
}
