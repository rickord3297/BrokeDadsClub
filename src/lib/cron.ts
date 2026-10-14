export function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Vercel crons run in UTC, so each job is scheduled twice (CDT and CST) and only the run at this Central hour acts. */
export function isCentralHour(now: Date, hour: number): boolean {
  const current = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "America/Chicago",
  }).format(now);
  return Number(current) === hour;
}
