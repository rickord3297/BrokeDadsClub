import type { Guide } from "@/lib/guide-model";
import {
  dealDisclosures,
  dealMerchantLabel,
  formatIssueDate,
  formatIssueNumber,
  formatTargetPrice,
  type NewsletterIssue,
} from "@/lib/newsletter-model";
import { site } from "@/lib/site";

const DIVIDER = "-".repeat(32);

/** Site links get UTM tags so email clicks show up in analytics. Off-site links pass through untouched. */
function emailHref(href: string, campaign: string): string {
  let url: URL;
  try {
    url = new URL(href, site.url);
  } catch {
    return href;
  }
  if (!/^https?:$/.test(url.protocol)) return href;
  if (url.hostname.replace(/^www\./, "") !== new URL(site.url).hostname.replace(/^www\./, "")) {
    return url.toString();
  }
  url.searchParams.set("utm_source", "newsletter");
  url.searchParams.set("utm_medium", "email");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

function markdownToPlainText(markdown: string, campaign: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, text: string, href: string) =>
      `${text} (${emailHref(href, campaign)})`,
    )
    .replace(/^#{1,6}\s+(.+)$/gm, (_, heading: string) => heading.toUpperCase())
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[*+]\s+/gm, "- ")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^*\w])[*_]([^*_\n]+)[*_](?=[^*\w]|$)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*(-{3,}|\*{3,})\s*$/gm, DIVIDER)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function section(title: string, body: string[]): string {
  return [title.toUpperCase(), DIVIDER, ...body].join("\n");
}

/** Plain-text draft of an issue, ready to paste into the email provider. */
export function buildIssueEmailText(issue: NewsletterIssue, featuredGuide: Guide | null): string {
  const campaign = `sunday-dispatch-${String(issue.issueNumber).padStart(3, "0")}`;
  const parts: string[] = [
    `THE SUNDAY DISPATCH · ${formatIssueNumber(issue.issueNumber).toUpperCase()} · ${formatIssueDate(issue.publishedAt)}`,
    issue.title,
    "",
    section("The Sunday Note", [markdownToPlainText(issue.content, campaign)]),
  ];

  const missed: string[] = [];
  if (featuredGuide) {
    missed.push(
      `FEATURED GUIDE: ${featuredGuide.title}`,
      issue.featuredGuideNote || featuredGuide.excerpt,
      ...featuredGuide.takeaways.map((item) => `- ${item}`),
      `Read the guide: ${emailHref(`/guides/${featuredGuide.slug}`, campaign)}`,
    );
  }
  for (const item of issue.whatYouMissed) {
    if (missed.length > 0) missed.push("");
    missed.push(
      `${item.type.toUpperCase()}: ${item.title}`,
      ...(item.description ? [item.description] : []),
      emailHref(item.href, campaign),
    );
  }
  if (missed.length > 0) {
    parts.push("", section("What You Missed This Week", missed));
  }

  if (issue.deals.length > 0) {
    const deals = issue.deals.flatMap((deal, index) => [
      ...(index > 0 ? [""] : []),
      `${index + 1}. ${deal.title} (${dealMerchantLabel(deal)})`,
      `Target price: ${formatTargetPrice(deal.targetPrice)}`,
      ...(deal.note ? [deal.note] : []),
      `Check price: ${deal.url}`,
    ]);
    parts.push(
      "",
      section("Dad Tax Offsets", [
        "Buy at or under the target price. Above it, wait.",
        "",
        ...deals,
        "",
        "Deals and target prices reflect the date of publication and may expire or change.",
        ...dealDisclosures(issue.deals),
      ]),
    );
  }

  parts.push("", `Read this issue online: ${emailHref(`/newsletter/${issue.slug}`, campaign)}`);
  return parts.join("\n");
}
