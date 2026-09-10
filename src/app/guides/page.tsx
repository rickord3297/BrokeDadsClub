import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { GuidesCrawlIndex } from "@/components/guides-crawl-index";
import { GuidesExplorer } from "@/components/guides-explorer";
import { JsonLd } from "@/components/json-ld";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import { GUIDE_PILLARS } from "@/lib/guide-pillars";
import {
  getGuideCategories,
  getGuides,
  toGuideListItem,
} from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Family Budget Guides for Dads",
  description:
    "Practical dad guides on money, groceries, school costs, kids, and gear. Written for fathers stretching every dollar without the shame spiral.",
  path: "/guides",
  keywords: [
    "dad guides",
    "family budget guides",
    "parenting on a budget",
    "frugal dad tips",
    "grocery budget guide",
  ],
});

export default async function GuidesPage() {
  const guides = getGuides();
  const categories = getGuideCategories(guides);
  const list = guides.map((guide) => {
    const tieIn = resourceTieInForGuide(guide.slug);
    return toGuideListItem(
      guide,
      tieIn ? { href: tieIn.href, label: tieIn.label } : null,
    );
  });

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Broke Dads Club guides",
    itemListElement: list.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/guides/${guide.slug}`,
      name: guide.title,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={itemListLd} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Filter by topic, skim the takeaways, then open what you need this week:
        groceries, school fees, money talks, and work that does not steal bedtime.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {GUIDE_PILLARS.map((pillar) => (
          <Link
            key={pillar.slug}
            href={`/guides/${pillar.slug}`}
            className="rounded-full border border-pine/25 bg-pine/[0.06] px-4 py-2 text-sm font-semibold text-pine transition hover:border-pine hover:bg-pine/10"
          >
            {pillar.category} hub
          </Link>
        ))}
      </div>

      <GuidesCrawlIndex guides={list} />

      <Suspense
        fallback={
          <div className="mt-10 h-40 animate-pulse rounded-2xl bg-paper-2" />
        }
      >
        <GuidesExplorer guides={list} categories={categories} />
      </Suspense>
    </div>
  );
}
