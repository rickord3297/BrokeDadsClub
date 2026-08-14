import { NextResponse } from "next/server";
import { getGuidesSince } from "@/lib/guides";
import { buildRecapEmail, recapWindowStart } from "@/lib/recap";
import { isSesConfigured, sendSesEmail } from "@/lib/ses";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isSesConfigured()) {
    return NextResponse.json(
      { message: "Amazon SES is not configured yet." },
      { status: 503 },
    );
  }

  const since = recapWindowStart();
  const guides = getGuidesSince(since);
  if (guides.length === 0) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "No new guides this week.",
      since,
    });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase service role is not configured." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .is("unsubscribed_at", null);

  if (error) {
    return NextResponse.json(
      { message: "Could not load subscribers." },
      { status: 500 },
    );
  }

  const subscribers = (data ?? []).filter(
    (row): row is { email: string; unsubscribe_token: string } =>
      typeof row.email === "string" &&
      typeof row.unsubscribe_token === "string",
  );

  let sent = 0;
  let failed = 0;
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${site.url}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    const recap = buildRecapEmail(guides, unsubscribeUrl);
    try {
      await sendSesEmail({
        to: subscriber.email,
        subject: recap.subject,
        html: recap.html,
        text: recap.text,
        unsubscribeUrl,
      });
      sent += 1;
    } catch {
      failed += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    since,
    guides: guides.map((guide) => guide.slug),
    attempted: subscribers.length,
    sent,
    failed,
  });
}
