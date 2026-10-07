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
  deals: NewsletterDeal[];
  /** Markdown body. */
  content: string;
};

export type NewsletterIssueListItem = Omit<NewsletterIssue, "content" | "deals"> & {
  dealCount: number;
};

export function toNewsletterListItem(issue: NewsletterIssue): NewsletterIssueListItem {
  const { slug, title, issueNumber, publishedAt, excerpt, deals } = issue;
  return { slug, title, issueNumber, publishedAt, excerpt, dealCount: deals.length };
}

export function formatTargetPrice(price: number): string {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}
