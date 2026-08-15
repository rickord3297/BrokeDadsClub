import type { Guide } from "@/lib/guides";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

const PAPER = "#f9f4e8";
const INK = "#1c1915";
const INK_SOFT = "#5c5348";
const PINE = "#2c5f63";
const RUST = "#d97b51";
const GOLD = "#d4a84b";
const RULE = "#e0d3bc";

export function recapWindowStart(now = new Date()): string {
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return start.toISOString().slice(0, 10);
}

export function buildRecapEmail(
  guides: Guide[],
  unsubscribeUrl: string,
  options?: { quietWeek?: boolean },
): { subject: string; html: string; text: string } {
  const quietWeek = Boolean(options?.quietWeek);
  const printableUrl = `${site.url}/resources`;
  const intro = quietWeek
    ? "Nothing new went up this week. Here is one thing worth using anyway, plus the fridge sheets if you need them."
    : "One useful thing to start the week. Not a pile of everything you missed.";
  const subject = quietWeek
    ? "Start this week: one useful thing from Broke Dads Club"
    : guides.length === 1
      ? `Start this week: ${guides[0].title}`
      : `Start this week: ${guides.length} new guides`;

  const text = [
    "Broke Dads Club",
    "Sunday email",
    "",
    intro,
    "",
    ...guides.flatMap((guide) => [
      `${guide.title} (${guide.category}, ${guide.readTime})`,
      guide.excerpt,
      `${site.url}/guides/${guide.slug}`,
      "",
    ]),
    "Fridge sheets:",
    ...resources.map(
      (resource) => `- ${resource.title}: ${site.url}/resources/${resource.slug}`,
    ),
    "",
    `All printables: ${printableUrl}`,
    `All guides: ${site.url}/guides`,
    "",
    site.tagline,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const guideBlocks = guides.map((guide) => guideCard(guide)).join("");
  const printableRows = resources
    .map(
      (resource) => `
        <tr>
          <td style="padding:0 0 14px 0;">
            <a href="${site.url}/resources/${resource.slug}" style="color:${PINE};text-decoration:none;font-family:Georgia,serif;font-size:16px;font-weight:bold;">${escapeHtml(resource.title)}</a>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:${INK_SOFT};padding-top:4px;">${escapeHtml(resource.excerpt)}</div>
          </td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(intro)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="background:${PINE};padding:28px 32px;border-radius:16px 16px 0 0;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">Sunday email</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;letter-spacing:0.08em;text-transform:uppercase;color:${PAPER};padding-top:8px;font-weight:bold;">Broke Dads Club</div>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;padding:32px;border-left:1px solid ${RULE};border-right:1px solid ${RULE};">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:${INK};font-weight:normal;">Start this week</h1>
              <p style="margin:14px 0 0;font-family:Georgia,serif;font-size:17px;line-height:1.6;color:${INK_SOFT};">${escapeHtml(intro)}</p>
              ${guideBlocks}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;background:${PAPER};border:1px solid ${RULE};border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">Fridge sheets</div>
                    <p style="margin:8px 0 16px;font-family:Georgia,serif;font-size:20px;color:${INK};">Printables if you need a working copy</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${printableRows}</table>
                    ${pillButton("Open the printables", printableUrl)}
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK};">That's it. Go feed somebody.</p>
            </td>
          </tr>
          <tr>
            <td style="background:${PINE};padding:22px 32px;border-radius:0 0 16px 16px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD};">${escapeHtml(site.tagline)}</p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${PAPER};">
                <a href="${site.url}/guides" style="color:${PAPER};">Guides</a>
                &nbsp;·&nbsp;
                <a href="${printableUrl}" style="color:${PAPER};">Printables</a>
                &nbsp;·&nbsp;
                <a href="${unsubscribeUrl}" style="color:${GOLD};">Unsubscribe</a>
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

function guideCard(guide: Guide) {
  const url = `${site.url}/guides/${guide.slug}`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;border-top:1px solid ${RULE};">
      <tr>
        <td style="padding:24px 0 8px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">${escapeHtml(guide.category)} · ${escapeHtml(guide.readTime)}</div>
          <h2 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;line-height:1.3;color:${INK};font-weight:normal;">
            <a href="${url}" style="color:${INK};text-decoration:none;">${escapeHtml(guide.title)}</a>
          </h2>
          <p style="margin:10px 0 18px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:${INK_SOFT};">${escapeHtml(guide.excerpt)}</p>
          ${pillButton("Read it", url)}
        </td>
      </tr>
    </table>`;
}

function pillButton(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:${PINE};border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${PAPER};text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
