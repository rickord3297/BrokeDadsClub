/** Seasonal windows for browse ranking. Month/day are 1-indexed, inclusive. */

export type SeasonId =
  | "halloween"
  | "thanksgiving"
  | "nfl"
  | "dst-fall"
  | "advent"
  | "heat"
  | "fall-break"
  | "back-to-school"
  | "youth-sports-fall";

type MonthDay = { month: number; day: number };

type SeasonWindow = {
  start: MonthDay;
  end: MonthDay;
};

const SEASON_WINDOWS: Record<SeasonId, SeasonWindow> = {
  halloween: { start: { month: 10, day: 1 }, end: { month: 11, day: 2 } },
  "dst-fall": { start: { month: 10, day: 20 }, end: { month: 11, day: 5 } },
  thanksgiving: { start: { month: 11, day: 1 }, end: { month: 11, day: 30 } },
  nfl: { start: { month: 9, day: 1 }, end: { month: 2, day: 15 } },
  advent: { start: { month: 11, day: 15 }, end: { month: 12, day: 31 } },
  heat: { start: { month: 9, day: 15 }, end: { month: 3, day: 31 } },
  "fall-break": { start: { month: 10, day: 1 }, end: { month: 11, day: 15 } },
  "back-to-school": { start: { month: 8, day: 1 }, end: { month: 9, day: 20 } },
  "youth-sports-fall": { start: { month: 8, day: 1 }, end: { month: 10, day: 15 } },
};

/** Slug → season. Guides not listed are evergreen. */
export const GUIDE_SEASONS: Record<string, SeasonId> = {
  "one-halloween-costume-not-three-events": "halloween",
  "the-class-party-signup-is-one-job": "halloween",
  "the-porch-bowl-is-one-bag": "halloween",
  "the-loop-ends-at-8": "halloween",
  "the-extra-hour-is-not-extra-sleep": "dst-fall",
  "four-seats-or-one-car": "thanksgiving",
  "the-basket-is-the-dinner": "thanksgiving",
  "the-pie-is-the-assignment": "thanksgiving",
  "nfl-on-a-budget": "nfl",
  "nfl-sunday-without-a-thousand-dollar-stream": "nfl",
  "one-nfl-game-for-four-is-a-second-vacation": "nfl",
  "nfl-home-watch-party-on-a-budget": "nfl",
  "fantasy-sunday-with-your-kid-no-betting-app": "nfl",
  "the-calendar-is-two-dollars": "advent",
  "the-heat-bill-before-it-gets-cold": "heat",
  "the-week-school-closes-and-work-does-not": "fall-break",
  "school-supply-list": "back-to-school",
  "the-second-bill": "back-to-school",
  "the-sports-signup-fee-you-didnt-budget-for": "youth-sports-fall",
  "first-youth-soccer-season-gear": "youth-sports-fall",
  "what-you-cut-so-the-kid-can-keep-playing-sports": "youth-sports-fall",
  "dont-say-yes-to-team-parent-first-huddle": "youth-sports-fall",
};

export type SeasonStatus = "active" | "expired" | "upcoming" | "none";

function dayOfYear(month: number, day: number): number {
  return month * 100 + day;
}

function isInWindow(now: Date, window: SeasonWindow): boolean {
  const current = dayOfYear(now.getUTCMonth() + 1, now.getUTCDate());
  const start = dayOfYear(window.start.month, window.start.day);
  const end = dayOfYear(window.end.month, window.end.day);
  if (start <= end) return current >= start && current <= end;
  // Wraps year (e.g. NFL Sep–Feb, heat Sep–Mar)
  return current >= start || current <= end;
}

function isBeforeWindow(now: Date, window: SeasonWindow): boolean {
  if (isInWindow(now, window)) return false;
  const current = dayOfYear(now.getUTCMonth() + 1, now.getUTCDate());
  const start = dayOfYear(window.start.month, window.start.day);
  const end = dayOfYear(window.end.month, window.end.day);
  if (start <= end) return current < start;
  // Wrap: "upcoming" only in the gap after end and before start
  return current > end && current < start;
}

export function seasonStatusForSlug(
  slug: string,
  now: Date = new Date(),
): SeasonStatus {
  const season = GUIDE_SEASONS[slug];
  if (!season) return "none";
  const window = SEASON_WINDOWS[season];
  if (isInWindow(now, window)) return "active";
  if (isBeforeWindow(now, window)) return "upcoming";
  return "expired";
}

/** Higher = more relevant right now. */
export function browsePriority(
  slug: string,
  publishedAt: string,
  now: Date = new Date(),
): number {
  const status = seasonStatusForSlug(slug, now);
  const published = Date.parse(`${publishedAt}T00:00:00.000Z`);
  const publishedScore = Number.isFinite(published) ? published / 1e13 : 0;

  if (status === "active") {
    // Thanksgiving outranks other active seasons in November.
    const season = GUIDE_SEASONS[slug];
    const seasonBoost = season === "thanksgiving" ? 3 : season === "nfl" ? 2 : 1;
    return 300 + seasonBoost + publishedScore;
  }
  if (status === "none" || status === "upcoming") {
    return 200 + publishedScore;
  }
  // Expired seasonal: keep, but below evergreen.
  return 100 + publishedScore;
}

export function compareGuidesForBrowse(
  a: { slug: string; publishedAt: string },
  b: { slug: string; publishedAt: string },
  now: Date = new Date(),
): number {
  return (
    browsePriority(b.slug, b.publishedAt, now) -
    browsePriority(a.slug, a.publishedAt, now)
  );
}

export function partitionGuidesForBrowse<T extends { slug: string; publishedAt: string }>(
  guides: T[],
  now: Date = new Date(),
): { current: T[]; pastSeason: T[] } {
  const current: T[] = [];
  const pastSeason: T[] = [];
  for (const guide of guides) {
    if (seasonStatusForSlug(guide.slug, now) === "expired") {
      pastSeason.push(guide);
    } else {
      current.push(guide);
    }
  }
  current.sort((a, b) => compareGuidesForBrowse(a, b, now));
  pastSeason.sort((a, b) => compareGuidesForBrowse(a, b, now));
  return { current, pastSeason };
}
