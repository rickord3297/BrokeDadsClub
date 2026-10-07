import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  APPROVED_MERCHANTS,
  AFFILIATE_CONFIG,
  AffiliateLinkError,
  amazonUrl,
  buildAffiliateUrl,
  findApprovedMerchant,
  isAsin,
  type ApprovedMerchant,
} from "@/lib/affiliate";
import {
  WHAT_YOU_MISSED_TYPES,
  type DealItem,
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

function parseMerchant(value: unknown, where: string): ApprovedMerchant {
  const merchant = typeof value === "string" ? findApprovedMerchant(value) : null;
  if (!merchant) {
    const allowed = APPROVED_MERCHANTS.map((id) => AFFILIATE_CONFIG[id].name).join(", ");
    throw new AffiliateLinkError(
      `${where}: merchant "${String(value)}" is not an approved affiliate merchant (allowed: ${allowed}).`,
    );
  }
  return merchant;
}

function resolveDealUrl(raw: string, merchant: ApprovedMerchant, where: string): string {
  try {
    return merchant === "amazon" && isAsin(raw) ? amazonUrl(raw) : buildAffiliateUrl(raw, merchant);
  } catch (error) {
    throw new AffiliateLinkError(`${where}: ${(error as Error).message}`);
  }
}

/** Merchant and link problems throw so an unmonetized or off-brand link can't ship. */
function parseDeals(value: unknown, file: string): DealItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const where = `newsletter ${file}, deal #${index + 1}`;
    const targetPrice =
      typeof row.targetPrice === "number" ? String(row.targetPrice) : row.targetPrice;
    if (
      !isNonEmptyString(row.title) ||
      !isNonEmptyString(targetPrice) ||
      typeof row.note !== "string" ||
      !isNonEmptyString(row.url)
    ) {
      console.error(`Skipping invalid deal #${index + 1} in newsletter ${file}`);
      return [];
    }
    const merchant = parseMerchant(row.merchant, where);
    const url = resolveDealUrl(row.url, merchant, where);
    return [
      {
        title: row.title.trim(),
        merchant,
        targetPrice: targetPrice.trim(),
        note: row.note.trim(),
        url,
      },
    ];
  });
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
            deals: parseDeals(data.deals, file),
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
export function getAllIssues(): NewsletterIssue[] {
  return readAllIssues().filter((issue) => isLive(issue));
}

export function getIssueBySlug(slug: string): NewsletterIssue | null {
  return getAllIssues().find((issue) => issue.slug === slug) ?? null;
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
