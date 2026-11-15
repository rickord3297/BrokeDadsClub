import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { AffiliateLinkError } from "@/lib/affiliate";
import { parseDealItems } from "@/lib/deal-parse";
import { getLatestIssue } from "@/lib/newsletter";
import type { DealItem } from "@/lib/newsletter-model";

export type DealsBoard = {
  title: string;
  intro: string;
  updatedAt: string;
  deals: DealItem[];
};

const dealsFile = path.join(process.cwd(), "content/deals/current.md");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (isNonEmptyString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  return null;
}

/** Live curated board from content/deals/current.md. */
export function getDealsBoard(): DealsBoard | null {
  if (!fs.existsSync(dealsFile)) return null;
  try {
    const { data } = matter(fs.readFileSync(dealsFile, "utf8"));
    const updatedAt = parseDate(data.updatedAt);
    if (!isNonEmptyString(data.title) || !updatedAt) {
      console.error("content/deals/current.md needs title and updatedAt (YYYY-MM-DD)");
      return null;
    }
    return {
      title: data.title.trim(),
      intro:
        typeof data.intro === "string" && data.intro.trim()
          ? data.intro.trim()
          : "Buy at or under the target price. Above it, wait.",
      updatedAt,
      deals: parseDealItems(data.deals, "deals board"),
    };
  } catch (error) {
    if (error instanceof AffiliateLinkError) throw error;
    console.error("Could not load deals board:", error);
    return null;
  }
}

/** Latest Sunday Dispatch deals, for the "this week" strip on /deals. */
export function getLatestDispatchDeals(): {
  issueSlug: string;
  issueTitle: string;
  issueNumber: number;
  publishedAt: string;
  deals: DealItem[];
} | null {
  const issue = getLatestIssue();
  if (!issue || issue.deals.length === 0) return null;
  return {
    issueSlug: issue.slug,
    issueTitle: issue.title,
    issueNumber: issue.issueNumber,
    publishedAt: issue.publishedAt,
    deals: issue.deals,
  };
}

/** Homepage teaser: board first, else latest Dispatch deals. */
export function getFeaturedDeals(limit = 3): DealItem[] {
  const board = getDealsBoard();
  if (board && board.deals.length > 0) return board.deals.slice(0, limit);
  return getLatestDispatchDeals()?.deals.slice(0, limit) ?? [];
}
