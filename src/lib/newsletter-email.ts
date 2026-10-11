import type { Guide } from "@/lib/guide-model";
import {
  dealDisclosures,
  dealMerchantLabel,
  formatIssueDate,
  formatIssueNumber,
  formatTargetPrice,
  type NewsletterIssue,
} from "@/lib/newsletter-model";
import { buildIssueEmailText, emailHref } from "@/lib/newsletter-email-text";
import { EMAIL_COLORS, escapeHtml, pillButton } from "@/lib/recap";
import { site } from "@/lib/site";

const { PAPER, INK, INK_SOFT, PINE, RUST, GOLD, RULE } = EMAIL_COLORS;

const BODY_TEXT = `font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${INK};`;
const KICKER = `font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};`;

function inlineMarkdown(text: string, campaign: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
      const url = escapeHtml(emailHref(href.replaceAll("&amp;", "&"), campaign));
      return `<a href="${url}" style="color:${PINE};">${label}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?=[^*\w]|$)/g, "$1<em>$2</em>");
}

/** Issue bodies are short notes: paragraphs, bold, links, bullet lists, quotes, and h2s. */
function markdownToEmailHtml(markdown: string, campaign: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim());
      if (lines.every((line) => /^[-*+]\s+/.test(line))) {
        const items = lines
          .map((line) => `<li style="margin:0 0 8px;">${inlineMarkdown(line.replace(/^[-*+]\s+/, ""), campaign)}</li>`)
          .join("");
        return `<ul style="margin:0 0 18px;padding-left:22px;${BODY_TEXT}">${items}</ul>`;
      }
      if (lines.every((line) => line.startsWith(">"))) {
        const text = lines.map((line) => line.replace(/^>\s?/, "")).join(" ");
        return `<p style="margin:0 0 18px;padding:12px 16px;border-left:4px solid ${GOLD};background:${PAPER};${BODY_TEXT}">${inlineMarkdown(text, campaign)}</p>`;
      }
      const heading = /^#{1,6}\s+(.+)$/.exec(lines[0]);
      if (heading && lines.length === 1) {
        return `<h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:21px;font-weight:normal;color:${INK};">${inlineMarkdown(heading[1], campaign)}</h2>`;
      }
      return `<p style="margin:0 0 18px;${BODY_TEXT}">${inlineMarkdown(lines.join(" "), campaign)}</p>`;
    })
    .join("\n");
}

function sectionBox(kicker: string, title: string, inner: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:${PAPER};border:1px solid ${RULE};border-radius:12px;">
      <tr>
        <td style="padding:22px 24px;">
          <div style="${KICKER}">${escapeHtml(kicker)}</div>
          <p style="margin:8px 0 16px;font-family:Georgia,serif;font-size:20px;color:${INK};">${escapeHtml(title)}</p>
          ${inner}
        </td>
      </tr>
    </table>`;
}

export function buildIssueEmail(
  issue: NewsletterIssue,
  featuredGuide: Guide | null,
  unsubscribeUrl: string,
): { subject: string; html: string; text: string } {
  const campaign = `sunday-dispatch-${String(issue.issueNumber).padStart(3, "0")}`;
  const issueLabel = formatIssueNumber(issue.issueNumber);
  const subject = `${issue.title} (Sunday Dispatch ${issueLabel.replace("Issue ", "")})`;
  const onlineUrl = emailHref(`/newsletter/${issue.slug}`, campaign);

  const text = [
    buildIssueEmailText(issue, featuredGuide),
    "",
    site.tagline,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const featured = featuredGuide
    ? sectionBox(
        "Featured guide",
        featuredGuide.title,
        `<p style="margin:0 0 18px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK_SOFT};">${escapeHtml(issue.featuredGuideNote || featuredGuide.excerpt)}</p>
         ${pillButton("Read the guide", emailHref(`/guides/${featuredGuide.slug}`, campaign))}`,
      )
    : "";

  const missed =
    issue.whatYouMissed.length > 0
      ? sectionBox(
          "What you missed",
          "New on the site this week",
          issue.whatYouMissed
            .map(
              (item) => `
          <div style="padding:0 0 14px;">
            <div style="${KICKER}color:${INK_SOFT};">${escapeHtml(item.type)}</div>
            <a href="${escapeHtml(emailHref(item.href, campaign))}" style="color:${PINE};text-decoration:none;font-family:Georgia,serif;font-size:16px;font-weight:bold;">${escapeHtml(item.title)}</a>
            ${item.description ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:${INK_SOFT};padding-top:4px;">${escapeHtml(item.description)}</div>` : ""}
          </div>`,
            )
            .join(""),
        )
      : "";

  const deals =
    issue.deals.length > 0
      ? sectionBox(
          "Dad tax offsets",
          "Buy at or under the target price. Above it, wait.",
          `${issue.deals
            .map(
              (deal) => `
          <div style="padding:0 0 16px;">
            <a href="${escapeHtml(deal.url)}" style="color:${PINE};text-decoration:none;font-family:Georgia,serif;font-size:16px;font-weight:bold;">${escapeHtml(deal.title)}</a>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${RUST};padding-top:4px;">${escapeHtml(dealMerchantLabel(deal))} · Target: ${escapeHtml(formatTargetPrice(deal.targetPrice))}</div>
            ${deal.note ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:${INK_SOFT};padding-top:4px;">${escapeHtml(deal.note)}</div>` : ""}
          </div>`,
            )
            .join("")}
          <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${INK_SOFT};">Deals and target prices reflect the date of publication and may expire or change. ${dealDisclosures(issue.deals).map(escapeHtml).join(" ")}</p>`,
        )
      : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(issue.excerpt)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${PINE};padding:28px 32px;border-radius:16px 16px 0 0;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">The Sunday Dispatch · ${escapeHtml(issueLabel)} · ${escapeHtml(formatIssueDate(issue.publishedAt))}</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;letter-spacing:0.08em;text-transform:uppercase;color:${PAPER};padding-top:8px;font-weight:bold;">Broke Dads Club</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;padding:32px;border-left:1px solid ${RULE};border-right:1px solid ${RULE};">
              <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:${INK};font-weight:normal;">${escapeHtml(issue.title)}</h1>
              ${markdownToEmailHtml(issue.content, campaign)}
              ${featured}
              ${missed}
              ${deals}
              <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${INK_SOFT};"><a href="${escapeHtml(onlineUrl)}" style="color:${PINE};">Read this issue online</a></p>
            </td>
          </tr>
          <tr>
            <td style="background:${PINE};padding:22px 32px;border-radius:0 0 16px 16px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD};">${escapeHtml(site.tagline)}</p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${PAPER};">
                <a href="${site.url}/newsletter" style="color:${PAPER};">Past dispatches</a>
                &nbsp;·&nbsp;
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

  return { subject, html, text };
}
