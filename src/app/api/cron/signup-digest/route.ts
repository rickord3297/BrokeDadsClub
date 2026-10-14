import { NextResponse } from "next/server";
import { isCentralHour, isCronAuthorized } from "@/lib/cron";
import { isGmailConfigured } from "@/lib/gmail";
import { sendSignupDigest } from "@/lib/signup-notify";

export const runtime = "nodejs";
export const maxDuration = 30;

const DIGEST_HOUR_CENTRAL = 22;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force && !isCentralHour(now, DIGEST_HOUR_CENTRAL)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Not 10 p.m. Central; the other scheduled run sends.",
    });
  }

  if (!isGmailConfigured()) {
    return NextResponse.json({ message: "Gmail is not configured." }, { status: 503 });
  }

  try {
    const result = await sendSignupDigest(new Date(now.getTime() - DAY_MS));
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error("Signup digest failed:", error);
    return NextResponse.json({ message: "Signup digest failed." }, { status: 500 });
  }
}
