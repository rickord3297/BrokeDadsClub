/** Shared newsletter issue shapes safe for client components. */

import { merchantDisclosures, merchantName, type ApprovedMerchant } from "@/lib/affiliate";

export interface DealItem {
  title: string;
  /** Enabled merchant id from AFFILIATE_CONFIG. */
  merchant: ApprovedMerchant;
  /** Display-ready price target, e.g. "$24.99", "Under $25", "$0.90/bar". */
  targetPrice: string;
  note: string;
  /** Tracked link from buildAffiliateUrl(), resolved at load time. */
  url: string;
}

export const WHAT_YOU_MISSED_TYPES = ["guide", "printable", "shop"] as const;
export type WhatYouMissedType = (typeof WHAT_YOU_MISSED_TYPES)[number];

export interface WhatYouMissedItem {
  title: string;
  /** Site path ("/guides/...", "/resources/...", "/shop/...") or absolute URL. */
  href: string;
  type: WhatYouMissedType;
  description: string;
}

export interface NewsletterIssue {
  slug: string;
  issueNumber: number;
  title: string;
  /** ISO date (YYYY-MM-DD) of the Sunday send. Future dates stay hidden until that day. */
  publishedAt: string;
  readTime: string;
  excerpt: string;
  /** Short bullets for the archive cards. */
  takeaways: string[];
  /** Primary guide spotlighted this week. Empty when the issue has no spotlight. */
  featuredGuideSlug: string;
  /** 1-2 sentence breakdown shown with the spotlight. */
  featuredGuideNote: string;
  whatYouMissed: WhatYouMissedItem[];
  deals: DealItem[];
  /** Markdown body: the Sunday Note. */
  content: string;
}

export type NewsletterIssueListItem = Pick<
  NewsletterIssue,
  "slug" | "issueNumber" | "title" | "publishedAt" | "readTime" | "excerpt" | "takeaways"
> & {
  dealCount: number;
};

export function toNewsletterListItem(issue: NewsletterIssue): NewsletterIssueListItem {
  const { slug, issueNumber, title, publishedAt, readTime, excerpt, takeaways, deals } = issue;
  return { slug, issueNumber, title, publishedAt, readTime, excerpt, takeaways, dealCount: deals.length };
}

export function dealMerchantLabel(deal: Pick<DealItem, "merchant">): string {
  return merchantName(deal.merchant);
}

/** Required affiliate disclosures for the merchants in a deal list. */
export function dealDisclosures(deals: Pick<DealItem, "merchant">[]): string[] {
  return merchantDisclosures(deals.map((deal) => deal.merchant));
}

/** Bare numbers like "24.99" get a dollar sign; anything else is shown as written. */
export function formatTargetPrice(price: string): string {
  const trimmed = price.trim();
  return /^\d+(\.\d{1,2})?$/.test(trimmed) ? `$${trimmed}` : trimmed;
}

/** Issue dates are calendar days, so format in UTC to avoid slipping to Saturday in US timezones. */
export function formatIssueDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00.000Z`));
}

export function formatIssueNumber(issueNumber: number): string {
  return `Issue #${String(issueNumber).padStart(2, "0")}`;
}
