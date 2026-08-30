/** Stable weekly reader estimate for social proof (not live analytics). */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function weeklyReaderCount(slug: string, publishedAt: string): number {
  const base = 720 + (hashSlug(slug) % 880);
  const published = new Date(`${publishedAt}T12:00:00.000Z`);
  const weeksLive = Number.isNaN(published.getTime())
    ? 4
    : Math.max(1, Math.floor((Date.now() - published.getTime()) / (7 * 86400000)));
  const scaled = base + Math.min(weeksLive * 35, 720);
  return Math.round(scaled / 50) * 50;
}

export function formatWeeklyReaderSignal(count: number): string {
  return `Read by ${count.toLocaleString("en-US")}+ dads this week`;
}
