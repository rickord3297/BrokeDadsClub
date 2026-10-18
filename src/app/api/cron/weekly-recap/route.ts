import { NextResponse } from "next/server";
import {
  centralDateString,
  isCronAuthorized,
  isWeeklyRecapSendWindow,
} from "@/lib/cron";
import {
  WEEKLY_RECAP_JOB,
  claimCronJobRun,
  completeCronJobRun,
} from "@/lib/cron-job-runs";
import { isUndeliverableTestAddress, normalizeEmail, validateEmail } from "@/lib/email";
import { isGmailConfigured, sendGmail } from "@/lib/gmail";
import { getGuide, getGuides, getGuidesSince } from "@/lib/guides";
import { getAllIssues, getIssueBySlug, getLatestIssue } from "@/lib/newsletter";
import { buildIssueEmail } from "@/lib/newsletter-email";
import { buildRecapEmail, recapWindowStart } from "@/lib/recap";
import { isSesConfigured, sendSesEmail } from "@/lib/ses";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

type SendInput = { to: string; subject: string; html: string; text: string; unsubscribeUrl?: string };

/** SES when configured; otherwise Gmail, which caps a Workspace account at about 2,000 recipients a day. */
function pickSender(): ((input: SendInput) => Promise<void>) | null {
  if (isSesConfigured()) return sendSesEmail;
  if (isGmailConfigured()) return sendGmail;
  return null;
}

/** Prefer the issue dated today (Central), else the newest issue published in the last week. */
function pickSundayIssue(now: Date) {
  const today = centralDateString(now);
  const since = recapWindowStart(now);
  const live = getAllIssues(now);
  return (
    live.find((item) => item.publishedAt === today) ??
    live.find((item) => item.publishedAt > since) ??
    null
  );
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const params = new URL(request.url).searchParams;
  const testTo = normalizeEmail(params.get("test") ?? "");
  const force = params.get("force") === "1";
  if (!testTo && !force && !isWeeklyRecapSendWindow(now)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Outside the Sunday 9–11 a.m. Central send window; another scheduled run covers DST.",
    });
  }

  const send = pickSender();
  if (!send) {
    return NextResponse.json(
      { message: "No email sender is configured (Amazon SES or Gmail)." },
      { status: 503 },
    );
  }

  if (testTo) {
    if (validateEmail(testTo)) {
      return NextResponse.json({ message: "test must be a valid email." }, { status: 400 });
    }
    const slug = params.get("issue");
    const testIssue = slug ? getIssueBySlug(slug) : getLatestIssue();
    if (!testIssue) {
      return NextResponse.json({ message: "No live issue to test." }, { status: 404 });
    }
    const testGuide = testIssue.featuredGuideSlug ? getGuide(testIssue.featuredGuideSlug) : null;
    const email = buildIssueEmail(testIssue, testGuide, `${site.url}/unsubscribe`);
    await send({ to: testTo, subject: `[Test] ${email.subject}`, html: email.html, text: email.text });
    return NextResponse.json({ ok: true, test: true, to: testTo, issue: testIssue.slug });
  }

  const since = recapWindowStart(now);
  const issue = pickSundayIssue(now);
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

  const runDate = centralDateString(now);
  if (!force) {
    const claim = await claimCronJobRun(
      supabase,
      WEEKLY_RECAP_JOB,
      runDate,
      issue?.slug ?? null,
    );
    if (!claim.ok) {
      return NextResponse.json({ message: claim.message }, { status: 500 });
    }
    if (!claim.claimed) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Already sent (or claimed) for this Central date.",
        runDate,
        previous: claim.existing,
      });
    }
  } else {
    // Manual force still records a completed row so a later cron cannot double-send.
    await claimCronJobRun(supabase, WEEKLY_RECAP_JOB, runDate, issue?.slug ?? null);
  }

  const { data, error } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .is("unsubscribed_at", null);

  if (error) {
    // Release the day claim so the catch-up slot can retry.
    await supabase
      .from("cron_job_runs")
      .delete()
      .eq("job", WEEKLY_RECAP_JOB)
      .eq("run_date", runDate)
      .eq("status", "claimed");
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
      await send({
        to: subscriber.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
        unsubscribeUrl,
      });
      sent += 1;
    } catch (sendError) {
      console.error(`Weekly send failed for one subscriber:`, sendError);
      failed += 1;
    }
  }

  const ownerCopyTo = normalizeEmail(process.env.NEWSLETTER_OWNER_COPY ?? "");
  let ownerCopy = false;
  if (ownerCopyTo && !subscribers.some((row) => normalizeEmail(row.email) === ownerCopyTo)) {
    const copy = issue
      ? buildIssueEmail(issue, featuredGuide, `${site.url}/unsubscribe`)
      : buildRecapEmail(guides, `${site.url}/unsubscribe`, { quietWeek });
    try {
      await send({
        to: ownerCopyTo,
        subject: `[Owner copy, sent to ${sent}] ${copy.subject}`,
        html: copy.html,
        text: copy.text,
      });
      ownerCopy = true;
    } catch (copyError) {
      console.error("Owner copy failed:", copyError);
    }
  }

  await completeCronJobRun(supabase, WEEKLY_RECAP_JOB, runDate, {
    issueSlug: issue?.slug ?? null,
    attempted: subscribers.length,
    sent,
    failed,
  });

  return NextResponse.json({
    ok: true,
    since,
    runDate,
    ownerCopy,
    issue: issue?.slug ?? null,
    quietWeek,
    guides: issue ? [] : guides.map((guide) => guide.slug),
    attempted: subscribers.length,
    sent,
    failed,
  });
}
