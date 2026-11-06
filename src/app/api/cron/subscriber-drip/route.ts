import { NextResponse } from "next/server";
import { isCentralHour, isCronAuthorized } from "@/lib/cron";
import { isGmailConfigured } from "@/lib/gmail";
import { sendSubscriberDrips } from "@/lib/drip-email";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Mid-morning Central so welcome emails have settled and Sunday Dispatch is not competing. */
const SEND_HOUR_CENTRAL = 10;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force && !isCentralHour(now, SEND_HOUR_CENTRAL)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Not 10 a.m. Central; the other scheduled run sends.",
    });
  }

  if (!isGmailConfigured()) {
    return NextResponse.json({ message: "Gmail is not configured." }, { status: 503 });
  }

  try {
    const result = await sendSubscriberDrips(now);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error("Subscriber drip failed:", error);
    return NextResponse.json({ message: "Subscriber drip failed." }, { status: 500 });
  }
}
