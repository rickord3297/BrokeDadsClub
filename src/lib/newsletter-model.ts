/** Shared newsletter issue shapes safe for client components. */

export const DEAL_MERCHANTS = ["Amazon", "Home Depot", "Target", "Other"] as const;
export type DealMerchant = (typeof DEAL_MERCHANTS)[number];

export interface DealItem {
  title: string;
  merchant: DealMerchant;
  /** Display-ready price target, e.g. "$24.99", "Under $25", "$0.90/bar". */
  targetPrice: string;
  note: string;
  /** Clean retailer URL or amazonUrl() output. Amazon links are tagged at load time. Render with rel="sponsored noopener". */
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

/** "Other" merchants show the retailer's domain instead of a generic label. */
export function dealMerchantLabel(deal: Pick<DealItem, "merchant" | "url">): string {
  if (deal.merchant !== "Other") return deal.merchant;
  try {
    return new URL(deal.url).hostname.replace(/^www\./, "");
  } catch {
    return "Retailer";
  }
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
