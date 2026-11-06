import { isUndeliverableTestAddress } from "@/lib/email";
import { isGmailConfigured, sendGmail } from "@/lib/gmail";
import { getLatestIssue, formatIssueNumber } from "@/lib/newsletter";
import { EMAIL_COLORS, escapeHtml, pillButton } from "@/lib/recap";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

const { PAPER, INK, INK_SOFT, PINE, RUST, GOLD, RULE } = EMAIL_COLORS;

export type DripKind = "day3" | "day7";

type SubscriberRow = {
  email: string;
  unsubscribe_token: string;
  created_at: string;
  drip_day3_sent_at: string | null;
  drip_day7_sent_at: string | null;
};

function utm(campaign: string): string {
  return `utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}`;
}

function siteLink(path: string, campaign: string): string {
  return `${site.url}${path}${path.includes("?") ? "&" : "?"}${utm(campaign)}`;
}

function dayWindow(now: Date, day: number): { start: string; end: string } {
  const end = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

function buildDay3(unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const campaign = "drip-day3";
  const checklistUrl = siteLink("/resources/grocery-week-checklist", campaign);
  const guideUrl = siteLink("/guides/the-47-dollar-grocery-week", campaign);
  const subject = "One rule for the grocery list";
  const text = [
    "Quick check-in.",
    "",
    "If the PDF is still sitting in your inbox, use one rule this week: nothing in the cart gets bought for one night. One pack of chicken is Monday and Tuesday.",
    "",
    `Fill the checklist on your phone: ${checklistUrl}`,
    `The full walkthrough: ${guideUrl}`,
    "",
    "Sunday still brings one short tactic. No daily pile.",
    "",
    site.tagline,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = emailShell(
    subject,
    "Day 3",
    "One rule for the grocery list",
    `
      <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${INK};">If the PDF is still sitting in your inbox, use <strong>one rule</strong> this week: nothing in the cart gets bought for one night. One pack of chicken is Monday and Tuesday.</p>
      ${pillButton("Fill the checklist", checklistUrl)}
      <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${INK_SOFT};">Or read <a href="${escapeHtml(guideUrl)}" style="color:${PINE};">the $47 grocery week</a>.</p>
      <p style="margin:22px 0 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">Sunday still brings one short tactic. No daily pile.</p>
    `,
    unsubscribeUrl,
  );

  return { subject, html, text };
}

function buildDay7(unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const campaign = "drip-day7";
  const latest = getLatestIssue();
  const latestUrl = latest ? siteLink(`/newsletter/${latest.slug}`, campaign) : null;
  const guidesUrl = siteLink("/guides", campaign);
  const subject = latest ? `While you wait: ${latest.title}` : "One useful thing before Sunday";
  const text = [
    "You've been on the list about a week.",
    "",
    latest && latestUrl
      ? `The latest Sunday Dispatch (${formatIssueNumber(latest.issueNumber)}): ${latest.title}\n${latestUrl}`
      : `Browse the guides while you wait for Sunday:\n${guidesUrl}`,
    "",
    "One email every Sunday at 9 a.m. Central. Unsubscribe anytime if it is not earning its keep.",
    "",
    site.tagline,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const body = latest && latestUrl
    ? `
      <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${INK};">You've been on the list about a week. Here is the latest Dispatch while you wait for the next Sunday drop.</p>
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">${escapeHtml(formatIssueNumber(latest.issueNumber))}</p>
      <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:22px;line-height:1.3;color:${INK};">${escapeHtml(latest.title)}</p>
      ${pillButton("Read the Dispatch", latestUrl)}
    `
    : `
      <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${INK};">You've been on the list about a week. Browse the guides while you wait for Sunday.</p>
      ${pillButton("Read the guides", guidesUrl)}
    `;

  const html = emailShell(
    subject,
    "Day 7",
    subject,
    `${body}
      <p style="margin:22px 0 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">One email every Sunday at 9 a.m. Central. Unsubscribe anytime if it is not earning its keep.</p>`,
    unsubscribeUrl,
  );

  return { subject, html, text };
}

function emailShell(
  subject: string,
  kicker: string,
  heading: string,
  inner: string,
  unsubscribeUrl: string,
): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${PINE};padding:28px 32px;border-radius:16px 16px 0 0;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">${escapeHtml(kicker)} · Broke Dads Club</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;padding:32px;border-left:1px solid ${RULE};border-right:1px solid ${RULE};">
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:${INK};font-weight:normal;">${escapeHtml(heading)}</h1>
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="background:${PINE};padding:22px 32px;border-radius:0 0 16px 16px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD};">${escapeHtml(site.tagline)}</p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${PAPER};">
                <a href="${site.url}/guides" style="color:${PAPER};">Guides</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(unsubscribeUrl)}" style="color:${GOLD};">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type DripSendResult = {
  ok: true;
  day3: { attempted: number; sent: number; failed: number };
  day7: { attempted: number; sent: number; failed: number };
};

/** Sends day-3 and day-7 drip emails to subscribers who hit those windows and have not received them. */
export async function sendSubscriberDrips(now = new Date()): Promise<DripSendResult | { ok: false; message: string }> {
  if (!isGmailConfigured()) return { ok: false, message: "Gmail is not configured." };
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, message: "Supabase service role is not configured." };

  const day3 = await sendDripBatch(supabase, "day3", now);
  const day7 = await sendDripBatch(supabase, "day7", now);
  return { ok: true, day3, day7 };
}

async function sendDripBatch(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  kind: DripKind,
  now: Date,
): Promise<{ attempted: number; sent: number; failed: number }> {
  const day = kind === "day3" ? 3 : 7;
  const column = kind === "day3" ? "drip_day3_sent_at" : "drip_day7_sent_at";
  const { start, end } = dayWindow(now, day);

  const { data, error } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token, created_at, drip_day3_sent_at, drip_day7_sent_at")
    .is("unsubscribed_at", null)
    .is(column, null)
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error(`Drip ${kind} load failed:`, error);
    return { attempted: 0, sent: 0, failed: 0 };
  }

  const rows = (data ?? []).filter(
    (row): row is SubscriberRow =>
      typeof row.email === "string" &&
      typeof row.unsubscribe_token === "string" &&
      !isUndeliverableTestAddress(row.email),
  );

  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    const unsubscribeUrl = `${site.url}/unsubscribe?token=${row.unsubscribe_token}`;
    const email = kind === "day3" ? buildDay3(unsubscribeUrl) : buildDay7(unsubscribeUrl);
    try {
      await sendGmail({
        to: row.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
        unsubscribeUrl,
      });
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({ [column]: now.toISOString() })
        .eq("email", row.email)
        .is(column, null);
      if (updateError) {
        console.error(`Drip ${kind} mark failed for one subscriber:`, updateError);
      }
      sent += 1;
    } catch (sendError) {
      console.error(`Drip ${kind} send failed:`, sendError);
      failed += 1;
    }
  }

  return { attempted: rows.length, sent, failed };
}
