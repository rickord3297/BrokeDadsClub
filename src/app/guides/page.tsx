import type { Metadata } from "next";
import { Suspense } from "react";
import { GuidesExplorer } from "@/components/guides-explorer";
import type { GuideListItem } from "@/lib/guide-list";
import { takeawaysFromFaq } from "@/lib/guide-display";
import { getGuideCategories, getGuides } from "@/lib/guides";
import {
  getResourceForGuide,
  SHOP_CALLOUT_LABELS,
} from "@/lib/resources";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical dad guides on money, time, kids, and gear, written for fathers stretching every dollar.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const guides = getGuides();
  const categories = getGuideCategories(guides);

  const guideItems: GuideListItem[] = guides.map((guide) => {
    const resource = getResourceForGuide(guide.slug);
    const shopSlug = guide.shop[0];
    return {
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.excerpt,
      category: guide.category,
      readTime: guide.readTime,
      publishedAt: guide.publishedAt,
      takeaways: takeawaysFromFaq(guide.faq),
      resourceSlug: resource?.slug,
      resourceTitle: resource?.title,
      shopSlug,
      shopLabel: shopSlug ? SHOP_CALLOUT_LABELS[shopSlug] : undefined,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Not a lifestyle magazine. Tactics you can use this week: groceries,
        school fees, talking about money, and work that doesn&apos;t steal bedtime.
      </p>

      <Suspense
        fallback={
          <div className="mt-10 h-40 animate-pulse rounded-2xl bg-paper-2" />
        }
      >
        <GuidesExplorer guides={guideItems} categories={categories} />
      </Suspense>
    </div>
  );
}
