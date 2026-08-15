import type { Guide } from "@/lib/guides";
import { site } from "@/lib/site";

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
  const subject = quietWeek
    ? "Start this week: one useful thing from Broke Dads Club"
    : guides.length === 1
      ? `Start this week: ${guides[0].title}`
      : `Start this week: ${guides.length} new guides`;

  const intro = quietWeek
    ? "Nothing new published this week. Here is the thing worth using anyway, plus the printables if you need a sheet on the fridge."
    : "Start the week with this, not a pile of everything you missed:";

  const links = guides
    .map((guide) => `- ${guide.title}: ${site.url}/guides/${guide.slug}`)
    .join("\n");

  const text = [
    intro,
    "",
    links,
    "",
    "Printables: " + printableUrl,
    "All guides: " + site.url + "/guides",
    "",
    "Unsubscribe: " + unsubscribeUrl,
  ].join("\n");

  const items = guides
    .map(
      (guide) =>
        `<li style="margin:0 0 12px;"><a href="${site.url}/guides/${guide.slug}">${escapeHtml(guide.title)}</a><br /><span style="color:#5c5348;">${escapeHtml(guide.excerpt)}</span></li>`,
    )
    .join("");

  const html = `<!doctype html>
<html><body style="font-family:Georgia,serif;color:#1c1915;line-height:1.5;padding:24px;">
  <p>${escapeHtml(intro)}</p>
  <ul>${items}</ul>
  <p><a href="${printableUrl}">Free printables</a> · <a href="${site.url}/guides">All guides</a></p>
  <p style="font-size:12px;color:#5c5348;"><a href="${unsubscribeUrl}">Unsubscribe</a></p>
</body></html>`;

  return { subject, html, text };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
