import { NextResponse } from "next/server";
import { getGuide, getGuides, getGuidesSince } from "@/lib/guides";
import { getAllIssues } from "@/lib/newsletter";
import { buildIssueEmail } from "@/lib/newsletter-email";
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

const SEND_HOUR_CENTRAL = 9;

/** Reserved test domains never deliver; sending to them bounces and hurts the SES sender reputation. */
function isUndeliverableTestAddress(email: string): boolean {
  const domain = email.split("@").pop()?.trim().toLowerCase() ?? "";
  return /(^|\.)example\.(com|net|org)$/.test(domain) || /\.(test|invalid|example|localhost)$/.test(domain);
}

/** vercel.json schedules 14:00 and 15:00 UTC; only the run that lands at 9 a.m. Central sends, so DST never shifts it. */
function isSendHour(now: Date): boolean {
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "America/Chicago",
  }).format(now);
  return Number(hour) === SEND_HOUR_CENTRAL;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force && !isSendHour(now)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `Not ${SEND_HOUR_CENTRAL} a.m. Central; the other scheduled run sends.`,
    });
  }

  if (!isSesConfigured()) {
    return NextResponse.json(
      { message: "Amazon SES is not configured yet." },
      { status: 503 },
    );
  }

  const since = recapWindowStart(now);
  const issue = getAllIssues(now).find((item) => item.publishedAt > since) ?? null;
  const featuredGuide =
    issue?.featuredGuideSlug ? getGuide(issue.featuredGuideSlug) : null;
  const publishedThisWeek = getGuidesSince(since);
  const quietWeek = publishedThisWeek.length === 0;
  const fallback =
    getGuides().find((guide) => guide.slug === "the-47-dollar-grocery-week") ??
    getGuides()[0];
  const guides = quietWeek ? (fallback ? [fallback] : []) : publishedThisWeek;
  if (!issue && guides.length === 0) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "No guides available to send.",
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
      typeof row.unsubscribe_token === "string" &&
      !isUndeliverableTestAddress(row.email),
  );

  let sent = 0;
  let failed = 0;
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${site.url}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    const email = issue
      ? buildIssueEmail(issue, featuredGuide, unsubscribeUrl)
      : buildRecapEmail(guides, unsubscribeUrl, { quietWeek });
    try {
      await sendSesEmail({
        to: subscriber.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
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
    issue: issue?.slug ?? null,
    quietWeek,
    guides: issue ? [] : guides.map((guide) => guide.slug),
    attempted: subscribers.length,
    sent,
    failed,
  });
}
