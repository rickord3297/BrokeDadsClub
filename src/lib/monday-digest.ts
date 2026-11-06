import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { isUndeliverableTestAddress } from "@/lib/email";
import { sendGmail } from "@/lib/gmail";
import { getAllIssues } from "@/lib/newsletter";
import { getGuides } from "@/lib/guides";
import { getLivePrintables } from "@/lib/printables";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_NOTIFY_TO = "dad@brokedadsclub.com";
const GSC_URL =
  "https://search.google.com/search-console?resource_id=sc-domain%3Abrokedadsclub.com";

export type MondayDigestResult =
  | { ok: true; sent: true }
  | { ok: false; message: string };

function isoDaysAgo(days: number, now = new Date()): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function guideSeoGaps(): string[] {
  const dir = path.join(process.cwd(), "content/guides");
  if (!existsSync(dir)) return [];
  const gaps: string[] = [];
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".md"))) {
    const { data } = matter(readFileSync(path.join(dir, file), "utf8"));
    const status = typeof data.status === "string" ? data.status : "";
    if (status === "draft") continue;
    const slug = typeof data.slug === "string" ? data.slug : file.replace(/\.md$/, "");
    const title = typeof data.title === "string" ? data.title : slug;
    if (!data.seoTitle) gaps.push(`${title}: missing seoTitle`);
    const description =
      typeof data.description === "string"
        ? data.description
        : typeof data.excerpt === "string"
          ? data.excerpt
          : "";
    if (!description.trim()) gaps.push(`${title}: missing description`);
    else if (description.trim().length > 170) {
      gaps.push(`${title}: description looks long (${description.trim().length} chars)`);
    }
    const related = Array.isArray(data.related) ? data.related : [];
    if (related.length === 0) gaps.push(`${title}: no related links`);
  }
  return gaps.slice(0, 8);
}

/** Owner Monday morning digest: list health, content that went live, SEO gaps, GSC checklist. */
export async function sendMondayDigest(now = new Date()): Promise<MondayDigestResult> {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, message: "Supabase service role is not configured." };

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoIso = weekAgo.toISOString();
  const sinceDate = isoDaysAgo(7, now);

  const { data: signups, error: signupError } = await supabase
    .from("subscribers")
    .select("email, source, created_at")
    .gte("created_at", weekAgoIso)
    .order("created_at", { ascending: true });
  if (signupError) return { ok: false, message: "Could not load subscribers." };

  const newSignups = (signups ?? []).filter(
    (row) => typeof row.email === "string" && !isUndeliverableTestAddress(row.email),
  );

  const { data: activeRows, error: activeError } = await supabase
    .from("subscribers")
    .select("email, unsubscribed_at")
    .order("created_at", { ascending: false });
  if (activeError) return { ok: false, message: "Could not load subscriber totals." };

  const all = (activeRows ?? []).filter(
    (row) => typeof row.email === "string" && !isUndeliverableTestAddress(row.email),
  );
  const active = all.filter((row) => row.unsubscribed_at == null).length;
  const unsubscribed = all.length - active;

  const guidesLive = getGuides().filter((guide) => guide.publishedAt >= sinceDate);
  const printablesLive = getLivePrintables().filter(
    (item) => item.publishedAt >= sinceDate,
  );
  const issuesLive = getAllIssues(now).filter((issue) => issue.publishedAt >= sinceDate);
  const seoGaps = guideSeoGaps();

  const lines = [
    `Monday site digest · ${site.name}`,
    "",
    "LIST",
    `- Active subscribers: ${active}`,
    `- Unsubscribed: ${unsubscribed}`,
    `- New this week: ${newSignups.length}`,
    ...(newSignups.length
      ? newSignups.map(
          (row) =>
            `  · ${row.email} (${row.source || "unknown"}, ${String(row.created_at).slice(0, 10)})`,
        )
      : ["  · None"]),
    "",
    "CONTENT LIVE IN THE LAST 7 DAYS",
    ...(guidesLive.length
      ? guidesLive.map((guide) => `- Guide: ${guide.title} (${guide.publishedAt})`)
      : ["- Guides: none"]),
    ...(printablesLive.length
      ? printablesLive.map((item) => `- Printable: ${item.title} (${item.publishedAt})`)
      : ["- Printables: none"]),
    ...(issuesLive.length
      ? issuesLive.map((issue) => `- Dispatch: ${issue.title} (${issue.publishedAt})`)
      : ["- Dispatch: none"]),
    "",
    "SEO GAPS (local audit, max 8)",
    ...(seoGaps.length ? seoGaps.map((gap) => `- ${gap}`) : ["- None flagged"]),
    "",
    "SEARCH CONSOLE CHECKLIST (10 minutes)",
    "1. Performance: queries with impressions and weak CTR. Fix 1-2 titles.",
    "2. Indexing: Pages with Discovered / not indexed. Request only the ones that matter.",
    "3. Confirm new URLs from this week appear in the sitemap after crawl.",
    "",
    `Open GSC: ${GSC_URL}`,
    `Site: ${site.url}`,
    "",
    "This is an owner digest. It is not a subscriber email.",
  ];

  await sendGmail({
    to: process.env.SIGNUP_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_TO,
    subject: `Monday digest: ${active} active, ${newSignups.length} new this week`,
    text: lines.join("\n"),
  });

  return { ok: true, sent: true };
}
