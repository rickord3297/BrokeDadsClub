import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { withAffiliateTag } from "@/lib/affiliate";
import type { NewsletterDeal, NewsletterIssue } from "@/lib/newsletter-model";

export type {
  NewsletterDeal,
  NewsletterIssue,
  NewsletterIssueListItem,
} from "@/lib/newsletter-model";
export {
  formatIssueDate,
  formatIssueNumber,
  formatTargetPrice,
  toNewsletterListItem,
} from "@/lib/newsletter-model";

const newsletterDir = path.join(process.cwd(), "content/newsletter");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseDeals(value: unknown, file: string): NewsletterDeal[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const targetPrice = Number(row.targetPrice);
    const affiliateUrl = isNonEmptyString(row.affiliateUrl)
      ? withAffiliateTag(row.affiliateUrl)
      : null;
    const valid =
      isNonEmptyString(row.title) &&
      isNonEmptyString(row.merchant) &&
      Number.isFinite(targetPrice) &&
      targetPrice >= 0 &&
      typeof row.note === "string" &&
      affiliateUrl != null;
    if (!valid) {
      console.error(`Skipping invalid deal #${index + 1} in newsletter ${file}`);
      return [];
    }
    return [
      {
        title: row.title as string,
        merchant: row.merchant as string,
        targetPrice,
        note: (row.note as string).trim(),
        affiliateUrl,
      },
    ];
  });
}

/** gray-matter turns unquoted YAML dates into Date objects. */
function parseDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (isNonEmptyString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  return null;
}

function readAllIssues(): NewsletterIssue[] {
  if (!fs.existsSync(newsletterDir)) return [];

  return fs
    .readdirSync(newsletterDir)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      try {
        const { data, content } = matter(
          fs.readFileSync(path.join(newsletterDir, file), "utf8"),
        );
        const publishedAt = parseDate(data.publishedAt);
        const issueNumber = Number(data.issueNumber);
        if (
          !isNonEmptyString(data.slug) ||
          !isNonEmptyString(data.title) ||
          !Number.isInteger(issueNumber) ||
          issueNumber < 1 ||
          !publishedAt
        ) {
          console.error(
            `Skipping invalid newsletter ${file}: needs slug, title, issueNumber, publishedAt (YYYY-MM-DD)`,
          );
          return [];
        }
        return [
          {
            slug: data.slug.trim(),
            title: data.title.trim(),
            issueNumber,
            publishedAt,
            excerpt: typeof data.excerpt === "string" ? data.excerpt.trim() : "",
            takeaways: Array.isArray(data.takeaways)
              ? data.takeaways.filter(isNonEmptyString).map((item) => item.trim())
              : [],
            deals: parseDeals(data.deals, file),
            content,
          },
        ];
      } catch (error) {
        console.error(`Skipping invalid newsletter ${file}:`, error);
        return [];
      }
    })
    .sort((a, b) => b.issueNumber - a.issueNumber);
}

function isLive(issue: NewsletterIssue, now = new Date()): boolean {
  return now.getTime() >= new Date(`${issue.publishedAt}T00:00:00.000Z`).getTime();
}

/** Live issues, newest first. */
export function getNewsletterIssues(): NewsletterIssue[] {
  return readAllIssues().filter((issue) => isLive(issue));
}

export function getNewsletterIssue(slug: string): NewsletterIssue | null {
  return getNewsletterIssues().find((issue) => issue.slug === slug) ?? null;
}

export function getAdjacentIssues(issue: NewsletterIssue): {
  newer: NewsletterIssue | null;
  older: NewsletterIssue | null;
} {
  const issues = getNewsletterIssues();
  const index = issues.findIndex((item) => item.slug === issue.slug);
  return {
    newer: index > 0 ? issues[index - 1] : null,
    older: index >= 0 && index < issues.length - 1 ? issues[index + 1] : null,
  };
}
