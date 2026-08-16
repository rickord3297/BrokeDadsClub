import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guide-article";
import { getAnyGuide, getRelatedGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guide draft preview",
  robots: { index: false, follow: false },
};

export default async function GuideDraftPreviewPage({
  params,
}: PageProps<"/preview/guides/[slug]">) {
  const { slug } = await params;
  const guide = getAnyGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide);
  return <GuideArticle guide={guide} related={related} preview />;
}
