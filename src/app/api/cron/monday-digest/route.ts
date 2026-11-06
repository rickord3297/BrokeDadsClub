import { NextResponse } from "next/server";
import { centralWeekday, isCentralHour, isCronAuthorized } from "@/lib/cron";
import { isGmailConfigured } from "@/lib/gmail";
import { sendMondayDigest } from "@/lib/monday-digest";

export const runtime = "nodejs";
export const maxDuration = 60;

const SEND_HOUR_CENTRAL = 9;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force) {
    if (centralWeekday(now) !== 1) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Not Monday Central.",
      });
    }
    if (!isCentralHour(now, SEND_HOUR_CENTRAL)) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Not 9 a.m. Central; the other scheduled run sends.",
      });
    }
  }

  if (!isGmailConfigured()) {
    return NextResponse.json({ message: "Gmail is not configured." }, { status: 503 });
  }

  try {
    const result = await sendMondayDigest(now);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error("Monday digest failed:", error);
    return NextResponse.json({ message: "Monday digest failed." }, { status: 500 });
  }
}
