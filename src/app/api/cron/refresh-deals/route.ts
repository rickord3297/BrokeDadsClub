import { NextResponse } from "next/server";
import { isAmazonCreatorsConfigured } from "@/lib/amazon-creators";
import { isCentralHour, isCronAuthorized } from "@/lib/cron";
import { refreshScannedDeals } from "@/lib/scanned-deals";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Refresh live Amazon markdowns twice a day at 8 a.m. and 2 p.m. Central. */
const SCAN_HOURS_CENTRAL = new Set([8, 14]);

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force) {
    const hourOk = [...SCAN_HOURS_CENTRAL].some((hour) => isCentralHour(now, hour));
    if (!hourOk) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Outside the 8 a.m. / 2 p.m. Central scan windows.",
      });
    }
  }

  if (!isAmazonCreatorsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Amazon Creators API is not configured. Add AMAZON_CREATORS_CREDENTIAL_ID, AMAZON_CREATORS_CREDENTIAL_SECRET, and AMAZON_CREATORS_CREDENTIAL_VERSION.",
      },
      { status: 503 },
    );
  }

  try {
    const result = await refreshScannedDeals();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error("Deal refresh failed:", error);
    return NextResponse.json({ message: "Deal refresh failed." }, { status: 500 });
  }
}
