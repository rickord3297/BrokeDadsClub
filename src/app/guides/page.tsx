import type { Metadata } from "next";
import { Suspense } from "react";
import { GuidesCrawlIndex } from "@/components/guides-crawl-index";
import { GuidesExplorer } from "@/components/guides-explorer";
import { JsonLd } from "@/components/json-ld";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import { GUIDE_PILLARS } from "@/lib/guide-pillars";
import { getLiveResources } from "@/lib/printables";
import {
  getGuidesForBrowse,
  partitionGuidesForBrowse,
  toGuideListItem,
} from "@/lib/guides";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const GUIDES_DESCRIPTION =
  "Browse every Broke Dads Club guide in one place: grocery weeks, school fees, after-school meltdowns, bedtime, and work that does not steal bedtime.";

const GUIDES_KEYWORDS = [
  "dad guides",
  "family budget guides",
  "parenting on a budget",
  "frugal dad tips",
  "grocery budget guide",
];

function pageNumberFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): number {
  const raw = searchParams.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Math.max(1, Number(value) || 1);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = pageNumberFromSearchParams(params);

  if (page > 1) {
    const title = `All Guides - Page ${page} · ${site.name}`;
    const canonical = absoluteUrl(`/guides?page=${page}`);
    return {
      title: { absolute: title },
      description: GUIDES_DESCRIPTION,
      keywords: [...GUIDES_KEYWORDS],
      alternates: { canonical },
      openGraph: {
        title,
        description: GUIDES_DESCRIPTION,
        url: canonical,
        siteName: site.name,
        type: "website",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: GUIDES_DESCRIPTION,
      },
    };
  }

  return buildPageMetadata({
    title: "All Guides: Money, Time, and Kids for Dads",
    description: GUIDES_DESCRIPTION,
    path: "/guides",
    keywords: GUIDES_KEYWORDS,
  });
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = pageNumberFromSearchParams(params);
  const guides = getGuidesForBrowse();
  const categories = GUIDE_PILLARS.map((pillar) => pillar.category).filter(
    (category) => guides.some((guide) => guide.category === category),
  );
  const liveResources = getLiveResources();
  const list = guides.map((guide) => {
    const tieIn = resourceTieInForGuide(guide.slug, liveResources);
    return toGuideListItem(
      guide,
      tieIn ? { href: tieIn.href, label: tieIn.label } : null,
    );
  });
  const { current, pastSeason } = partitionGuidesForBrowse(list);

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

      {/* Crawlable link list for bots; visually hidden so the card grid stays the UI */}
      <GuidesCrawlIndex guides={list} />

      <Suspense
        fallback={
          <div className="mt-10 h-40 animate-pulse rounded-2xl bg-paper-2" />
        }
      >
        <GuidesExplorer
          guides={list}
          currentGuides={current}
          pastSeasonGuides={pastSeason}
          categories={categories}
          initialPage={page}
        />
      </Suspense>
    </div>
  );
}
