import type { MetadataRoute } from "next";
import { GUIDE_PILLARS } from "@/lib/guide-pillars";
import { getGuides } from "@/lib/guides";
import type { Guide } from "@/lib/guide-model";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getAllIssues, type NewsletterIssue } from "@/lib/newsletter";
import { getProducts } from "@/lib/products";
import { getLiveResources } from "@/lib/printables";
import { absoluteUrl } from "@/lib/seo";

/** Hourly so scheduled guides enter the sitemap on their go-live date without a deploy. */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const SITE_EPOCH = new Date("2026-08-11T00:00:00.000Z");

function guideModified(guide: Guide): Date {
  const date = new Date(`${guide.updatedAt || guide.publishedAt}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? SITE_EPOCH : date;
}

function issueDate(issue: NewsletterIssue): Date {
  return new Date(`${issue.publishedAt}T12:00:00.000Z`);
}

function newest(dates: Date[]): Date {
  return dates.reduce((max, date) => (date > max ? date : max), SITE_EPOCH);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = getGuides();
  const issues = getAllIssues();
  const products = await getProducts();
  const now = new Date();
  const latestGuide = newest(guides.map(guideModified));

  const entries: Entry[] = [
    { url: absoluteUrl("/"), lastModified: latestGuide, changeFrequency: "daily", priority: 1.0 },
    { url: absoluteUrl("/guides"), lastModified: latestGuide, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    ...GUIDE_PILLARS.map((pillar) => ({
      url: absoluteUrl(`/guides/${pillar.slug}`),
      lastModified: newest(
        guides.filter((guide) => guide.category === pillar.category).map(guideModified),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...guides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guideModified(guide),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    {
      url: absoluteUrl("/newsletter"),
      lastModified: newest(issues.map(issueDate)),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...issues.map((issue) => ({
      url: absoluteUrl(`/newsletter/${issue.slug}`),
      lastModified: issueDate(issue),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),

    { url: absoluteUrl("/resources"), lastModified: latestGuide, changeFrequency: "monthly", priority: 0.6 },
    ...getLiveResources().map((resource) => ({
      url: absoluteUrl(`/resources/${resource.slug}`),
      lastModified: new Date(`${resource.publishedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...Object.keys(LEAD_MAGNETS).map((slug) => ({
      url: absoluteUrl(`/resources/${slug}`),
      lastModified: SITE_EPOCH,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...products.map((product) => ({
      url: absoluteUrl(`/shop/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),

    { url: absoluteUrl("/about"), lastModified: SITE_EPOCH, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/privacy"), lastModified: SITE_EPOCH, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: SITE_EPOCH, changeFrequency: "yearly", priority: 0.2 },
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
