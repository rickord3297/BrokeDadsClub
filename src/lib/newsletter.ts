import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { AffiliateLinkError } from "@/lib/affiliate";
import { parseDealItems } from "@/lib/deal-parse";
import {
  WHAT_YOU_MISSED_TYPES,
  type NewsletterIssue,
  type WhatYouMissedItem,
} from "@/lib/newsletter-model";

export type {
  DealItem,
  NewsletterIssue,
  NewsletterIssueListItem,
  WhatYouMissedItem,
  WhatYouMissedType,
} from "@/lib/newsletter-model";
export {
  WHAT_YOU_MISSED_TYPES,
  dealDisclosures,
  dealMerchantLabel,
  formatIssueDate,
  formatIssueNumber,
  formatTargetPrice,
  toNewsletterListItem,
} from "@/lib/newsletter-model";

const newsletterDir = path.join(process.cwd(), "content/newsletter");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseWhatYouMissed(value: unknown, file: string): WhatYouMissedItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const type = WHAT_YOU_MISSED_TYPES.find((option) => option === row.type);
    const href = isNonEmptyString(row.href) ? row.href.trim() : "";
    const validHref = href.startsWith("/") || /^https?:\/\//.test(href);
    if (!isNonEmptyString(row.title) || !type || !validHref) {
      console.error(`Skipping invalid whatYouMissed #${index + 1} in newsletter ${file}`);
      return [];
    }
    return [
      {
        title: row.title.trim(),
        href,
        type,
        description: typeof row.description === "string" ? row.description.trim() : "",
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
            issueNumber,
            title: data.title.trim(),
            publishedAt,
            readTime: isNonEmptyString(data.readTime) ? data.readTime.trim() : "4 min",
            excerpt: typeof data.excerpt === "string" ? data.excerpt.trim() : "",
            takeaways: Array.isArray(data.takeaways)
              ? data.takeaways.filter(isNonEmptyString).map((item) => item.trim())
              : [],
            featuredGuideSlug: isNonEmptyString(data.featuredGuideSlug)
              ? data.featuredGuideSlug.trim()
              : "",
            featuredGuideNote: isNonEmptyString(data.featuredGuideNote)
              ? data.featuredGuideNote.trim()
              : "",
            whatYouMissed: parseWhatYouMissed(data.whatYouMissed, file),
            deals: parseDealItems(data.deals, `newsletter ${file}`),
            content,
          },
        ];
      } catch (error) {
        if (error instanceof AffiliateLinkError) throw error;
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
export function getAllIssues(now = new Date()): NewsletterIssue[] {
  return readAllIssues().filter((issue) => isLive(issue, now));
}

/** By slug, including issues dated in the future (direct URL / local preview). */
export function getIssueBySlug(slug: string): NewsletterIssue | null {
  return readAllIssues().find((issue) => issue.slug === slug) ?? null;
}

export function getLatestIssue(): NewsletterIssue | null {
  return getAllIssues()[0] ?? null;
}

export function getAdjacentIssues(issue: NewsletterIssue): {
  newer: NewsletterIssue | null;
  older: NewsletterIssue | null;
} {
  const issues = getAllIssues();
  const index = issues.findIndex((item) => item.slug === issue.slug);
  return {
    newer: index > 0 ? issues[index - 1] : null,
    older: index >= 0 && index < issues.length - 1 ? issues[index + 1] : null,
  };
}
