import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticlePage } from "@/components/guide-article-page";
import {
  getGuide,
  getGuides,
  getRelatedGuides,
  guideKeywords,
} from "@/lib/guides";
import { guideSchemaDate } from "@/lib/guide-pillars";
import { OG_IMAGE } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };

  const url = `${site.url}/guides/${guide.slug}`;
  const keywords = guideKeywords(guide);

  return {
    title: { absolute: guide.seoTitle },
    description: guide.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: guide.seoTitle,
      description: guide.description,
      url,
      siteName: site.name,
      publishedTime: guideSchemaDate(guide.publishedAt),
      modifiedTime: guideSchemaDate(guide.updatedAt),
      tags: keywords,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide, 4);

  return <GuideArticlePage guide={guide} related={related} mode="public" />;
}
