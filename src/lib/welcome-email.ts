import { isUndeliverableTestAddress } from "@/lib/email";
import { isGmailConfigured, sendGmail } from "@/lib/gmail";
import { getLeadMagnet, getLeadMagnetPdf } from "@/lib/lead-magnets";
import { formatIssueNumber, getLatestIssue } from "@/lib/newsletter";
import { EMAIL_COLORS, escapeHtml, pillButton } from "@/lib/recap";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

const { PAPER, INK, INK_SOFT, PINE, RUST, GOLD, RULE } = EMAIL_COLORS;
const UTM = "utm_source=newsletter&utm_medium=email&utm_campaign=welcome";

function siteLink(path: string): string {
  return `${site.url}${path}${path.includes("?") ? "&" : "?"}${UTM}`;
}

export function buildWelcomeEmail(unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const latest = getLatestIssue();
  const checklistUrl = siteLink("/resources/grocery-week-checklist");
  const guideUrl = siteLink("/guides/the-47-dollar-grocery-week");
  const latestUrl = latest ? siteLink(`/newsletter/${latest.slug}`) : null;
  const subject = "Your grocery list is attached";
  const steps = [
    "Write the pairs on the fridge before you shop. Chicken: Mon, Tue. Beef: Wed, Thu.",
    "Shop once. The second trip is where the week goes over.",
    "Cook the whole pack the first night. Eat half, put half away before seconds.",
  ];

  const text = [
    "You're in.",
    "",
    "The grocery list is attached as a PDF, in case the download on the site didn't stick. Seven dinners for a family of four came to $44.04 at Walmart, because every item covers two nights.",
    "",
    "HOW TO USE IT",
    ...steps.map((step) => `- ${step}`),
    "",
    `Fill it in on your phone: ${checklistUrl}`,
    `The full write-up: ${guideUrl}`,
    "",
    "WHAT HAPPENS NEXT",
    "One email every Sunday at 9 a.m. Central. One tactic, a few real numbers, about four minutes. No daily pile.",
    ...(latest && latestUrl ? ["", `While you wait, the latest issue: ${latest.title}`, latestUrl] : []),
    "",
    "Hit reply if something on the list is off at your store. A real dad reads these.",
    "",
    site.tagline,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Seven dinners for $44.04. The list is attached, plus what happens on Sunday.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${PINE};padding:28px 32px;border-radius:16px 16px 0 0;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">Welcome to the club</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;letter-spacing:0.08em;text-transform:uppercase;color:${PAPER};padding-top:8px;font-weight:bold;">Broke Dads Club</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;padding:32px;border-left:1px solid ${RULE};border-right:1px solid ${RULE};">
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:${INK};font-weight:normal;">You're in.</h1>
              <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${INK};">The grocery list is <strong>attached as a PDF</strong>, in case the download on the site didn't stick. Seven dinners for a family of four came to <strong>$44.04</strong> at Walmart, because every item covers two nights.</p>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};padding-top:6px;">How to use it</div>
              <ol style="margin:10px 0 22px;padding-left:22px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">
                ${steps.map((step) => `<li style="margin:0 0 8px;">${escapeHtml(step)}</li>`).join("")}
              </ol>
              ${pillButton("Fill it in on your phone", checklistUrl)}
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${INK_SOFT};">Or read <a href="${escapeHtml(guideUrl)}" style="color:${PINE};">the full write-up</a>.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:${PAPER};border:1px solid ${RULE};border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">What happens next</div>
                    <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">One email every Sunday at 9 a.m. Central. One tactic, a few real numbers, about four minutes. No daily pile.</p>
                    ${
                      latest && latestUrl
                        ? `<p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:${INK_SOFT};">While you wait, ${escapeHtml(formatIssueNumber(latest.issueNumber))}: <a href="${escapeHtml(latestUrl)}" style="color:${PINE};font-weight:bold;">${escapeHtml(latest.title)}</a></p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">Hit reply if something on the list is off at your store. A real dad reads these.</p>
            </td>
          </tr>
          <tr>
            <td style="background:${PINE};padding:22px 32px;border-radius:0 0 16px 16px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD};">${escapeHtml(site.tagline)}</p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${PAPER};">
                <a href="${site.url}/guides" style="color:${PAPER};">Guides</a>
                &nbsp;·&nbsp;
                <a href="${site.url}/newsletter" style="color:${PAPER};">Past dispatches</a>
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

  return { subject, html, text };
}

async function unsubscribeUrlFor(email: string): Promise<string> {
  const supabase = createAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from("subscribers")
      .select("unsubscribe_token")
      .eq("email", email)
      .maybeSingle();
    if (typeof data?.unsubscribe_token === "string") {
      return `${site.url}/unsubscribe?token=${data.unsubscribe_token}`;
    }
  }
  return `${site.url}/unsubscribe`;
}

/** Sends the welcome email with the grocery PDF attached. Never throws: a failed welcome must not fail a signup. */
export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!isGmailConfigured() || isUndeliverableTestAddress(email)) return;
  try {
    const magnet = getLeadMagnet("grocery-reset-trunk-kit");
    const [unsubscribeUrl, pdf] = await Promise.all([
      unsubscribeUrlFor(email),
      magnet ? getLeadMagnetPdf(magnet) : Promise.resolve(null),
    ]);
    const welcome = buildWelcomeEmail(unsubscribeUrl);
    await sendGmail({
      to: email,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text,
      unsubscribeUrl,
      attachments:
        magnet && pdf
          ? [{ filename: magnet.fileName, content: pdf, contentType: "application/pdf" }]
          : undefined,
    });
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
}
