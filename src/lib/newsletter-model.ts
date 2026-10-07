/** Shared newsletter issue shapes safe for client components. */

export type NewsletterDeal = {
  title: string;
  merchant: string;
  /** Buy-at-or-under price in USD. */
  targetPrice: number;
  note: string;
  /** Outbound link. Render with rel="sponsored noopener" since it may carry an affiliate tag. */
  affiliateUrl: string;
};

export type NewsletterIssue = {
  slug: string;
  title: string;
  issueNumber: number;
  /** ISO date (YYYY-MM-DD) of the Sunday send. Future dates stay hidden until that day. */
  publishedAt: string;
  excerpt: string;
  /** Short bullets for archive cards. */
  takeaways: string[];
  deals: NewsletterDeal[];
  /** Markdown body. */
  content: string;
};

export type NewsletterIssueListItem = Omit<NewsletterIssue, "content" | "deals"> & {
  dealCount: number;
};

export function toNewsletterListItem(issue: NewsletterIssue): NewsletterIssueListItem {
  const { slug, title, issueNumber, publishedAt, excerpt, takeaways, deals } = issue;
  return { slug, title, issueNumber, publishedAt, excerpt, takeaways, dealCount: deals.length };
}

export function formatTargetPrice(price: number): string {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
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
