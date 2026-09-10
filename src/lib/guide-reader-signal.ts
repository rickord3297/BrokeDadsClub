/**
 * Stable cumulative reader signal for social proof (not live analytics).
 * Count is deterministic from slug + publish date and only increases as days pass.
 */

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function daysSincePublished(publishedAt: string, now = Date.now()): number {
  const published = new Date(`${publishedAt}T12:00:00.000Z`);
  if (Number.isNaN(published.getTime())) return 1;
  const days = Math.floor((now - published.getTime()) / 86400000);
  return Math.max(0, days);
}

/**
 * Cumulative "dads who opened this" estimate.
 * Floor rounding keeps the displayed number non-decreasing day over day.
 */
export function cumulativeReaderCount(
  slug: string,
  publishedAt: string,
  now = Date.now(),
): number {
  const hash = hashSlug(slug);
  const start = 80 + (hash % 140); // 80-219 on publish day
  const perDay = 2 + (hash % 4); // 2-5 new opens / day
  const days = daysSincePublished(publishedAt, now);
  const raw = start + days * perDay;
  // Floor to nearest 10 so the label never ticks down.
  return Math.max(10, Math.floor(raw / 10) * 10);
}

/** @deprecated Use cumulativeReaderCount */
export function weeklyReaderCount(slug: string, publishedAt: string): number {
  return cumulativeReaderCount(slug, publishedAt);
}

export function formatWeeklyReaderSignal(count: number): string {
  return `Opened by ${count.toLocaleString("en-US")}+ dads so far`;
}
