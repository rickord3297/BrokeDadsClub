import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron";
import {
  alertIfDown,
  buildLocalHealth,
  checkWatchedSites,
} from "@/lib/uptime";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const local = await buildLocalHealth();
  const watched = await checkWatchedSites();
  const checks = [...local.checks, ...watched];
  const failures = checks.filter((check) => !check.ok && !check.skipped);
  const emailed = await alertIfDown(failures);

  return NextResponse.json(
    {
      ok: failures.length === 0,
      checkedAt: local.checkedAt,
      emailed,
      checks,
    },
    { status: failures.length === 0 ? 200 : 503 },
  );
}
