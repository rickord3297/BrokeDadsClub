export function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Calendar date in America/Chicago as YYYY-MM-DD. */
export function centralDateString(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function centralHour(now = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/Chicago",
    }).format(now),
  );
}

export function centralWeekday(now = new Date()): number {
  // 0 = Sunday … 6 = Saturday in America/Chicago
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Chicago",
  }).format(now);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
}

/** Vercel crons run in UTC, so each job is scheduled twice (CDT and CST) and only the run at this Central hour acts. */
export function isCentralHour(now: Date, hour: number): boolean {
  return centralHour(now) === hour;
}

/**
 * Sunday Dispatch send window: 9–11 a.m. Central.
 * Primary UTC slots land at 9 a.m.; the extra hour covers Hobby ±59 min drift
 * and a late catch-up cron if the morning invoke never claimed the day.
 */
export function isWeeklyRecapSendWindow(now = new Date()): boolean {
  if (centralWeekday(now) !== 0) return false;
  const hour = centralHour(now);
  return hour >= 9 && hour <= 11;
}
