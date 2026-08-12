import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  content: string;
};

const guidesDir = path.join(process.cwd(), "content/guides");

export function getGuides(): Guide[] {
  if (!fs.existsSync(guidesDir)) return [];

  return fs
    .readdirSync(guidesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(guidesDir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: data.slug as string,
        title: data.title as string,
        excerpt: data.excerpt as string,
        category: data.category as string,
        readTime: data.readTime as string,
        publishedAt: data.publishedAt as string,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getGuide(slug: string): Guide | null {
  return getGuides().find((guide) => guide.slug === slug) ?? null;
}
