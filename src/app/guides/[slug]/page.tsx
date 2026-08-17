import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guide-article";
import {
  getGuide,
  getGuides,
  getRelatedGuides,
  guideKeywords,
} from "@/lib/guides";
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
      publishedTime: guide.publishedAt,
      tags: keywords,
      images: ["/brand/club-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.description,
      images: ["/brand/club-logo.png"],
    },
  };
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide);
  return <GuideArticle guide={guide} related={related} />;
}
