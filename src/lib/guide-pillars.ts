import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { authorBio } from "@/lib/author";
import {
  GUIDE_TOPIC_SLUGS,
  guideCategoryPath,
  topicSlugForCategory,
  type GuideTopicSlug,
} from "@/lib/guide-topics";

export type { GuideTopicSlug };
export { authorBio, guideCategoryPath, topicSlugForCategory };

export type GuidePillar = {
  slug: GuideTopicSlug;
  category: "Money" | "Time" | "Kids" | "Gear" | "Work";
  title: string;
  seoTitle: string;
  description: string;
  keywords: string[];
  /** Editable intro paragraphs from content/topics/<slug>.md */
  intro: string[];
};

const topicsDir = path.join(process.cwd(), "content/topics");

function parseKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function introParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function readTopic(slug: GuideTopicSlug): GuidePillar | null {
  const file = path.join(topicsDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const category = data.category;
    const title = data.title;
    if (typeof category !== "string" || typeof title !== "string") return null;
    const description =
      typeof data.description === "string" ? data.description : "";
    const seoTitle =
      typeof data.seoTitle === "string" && data.seoTitle.trim()
        ? data.seoTitle
        : `${title} | Broke Dads Club`;
    return {
      slug,
      category: category as GuidePillar["category"],
      title,
      seoTitle,
      description,
      keywords: parseKeywords(data.keywords),
      intro: introParagraphs(content),
    };
  } catch (error) {
    console.error(`Skipping invalid topic ${slug}:`, error);
    return null;
  }
}

export const GUIDE_PILLARS: GuidePillar[] = GUIDE_TOPIC_SLUGS.flatMap((slug) => {
  const topic = readTopic(slug);
  return topic ? [topic] : [];
});

export function getGuidePillar(slug: string): GuidePillar | null {
  return GUIDE_PILLARS.find((pillar) => pillar.slug === slug) ?? null;
}

/** Schema.org ISO-8601 datetime with timezone from a YYYY-MM-DD guide date. */
export function guideSchemaDate(isoDate: string): string {
  const day = isoDate.trim().slice(0, 10);
  return `${day}T00:00:00.000Z`;
}
