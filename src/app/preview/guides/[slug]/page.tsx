import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticlePage } from "@/components/guide-article-page";
import {
  getAllGuides,
  getGuideForPreview,
  getRelatedGuidesForPreview,
  guidePreviewState,
} from "@/lib/guides";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideForPreview(slug);
  if (!guide) return { title: "Guide preview" };

  return {
    title: `[Preview] ${guide.title}`,
    description: guide.description,
    robots: { index: false, follow: false },
  };
}

export default async function GuidePreviewPage({
  params,
}: PageProps<"/preview/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuideForPreview(slug);
  if (!guide) notFound();

  const previewState = guidePreviewState(guide);
  const related = getRelatedGuidesForPreview(guide, 4);

  return (
    <GuideArticlePage
      guide={guide}
      related={related}
      mode="preview"
      previewState={previewState}
    />
  );
}
