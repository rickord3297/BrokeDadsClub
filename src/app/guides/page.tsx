import type { Metadata } from "next";
import { Suspense } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuidesCrawlIndex } from "@/components/guides-crawl-index";
import { GuidesPagination } from "@/components/guides-pagination";
import { GuidesTopicNav } from "@/components/guides-topic-nav";
import { GuideSearch } from "@/components/guide-search";
import { JsonLd } from "@/components/json-ld";
import { NewsletterSignupCard } from "@/components/newsletter-signup-card";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import { GUIDE_PILLARS } from "@/lib/guide-pillars";
import {
  GUIDES_PAGE_SIZE,
  paginateItems,
  parseGuidePage,
} from "@/lib/guide-pagination";
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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = parseGuidePage(params);

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
        images: [
          {
            url: absoluteUrl("/opengraph-image"),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
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
  const page = parseGuidePage(params);
  const guides = getGuidesForBrowse();
  const categories = GUIDE_PILLARS.map((pillar) => pillar.category).filter(
    (category) => guides.some((guide) => guide.category === category),
  );
  const counts = Object.fromEntries(
    categories.map((category) => [
      category,
      guides.filter((guide) => guide.category === category).length,
    ]),
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
  const { page: safePage, totalPages, slice } = paginateItems(
    current,
    page,
    GUIDES_PAGE_SIZE,
  );
  const showHero = safePage === 1 && slice.length > 0;
  const hero = showHero ? slice[0] : null;
  const gridGuides = showHero ? slice.slice(1) : slice;
  const showPastShelf = safePage === 1 && pastSeason.length > 0;

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

  const rangeStart = current.length ? (safePage - 1) * GUIDES_PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(safePage * GUIDES_PAGE_SIZE, current.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={itemListLd} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Filter by topic, skim the takeaways, then open what you need this week:
        groceries, school fees, money talks, and work that does not steal bedtime.
      </p>

      <GuidesCrawlIndex guides={list} />

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <GuidesTopicNav
            categories={categories}
            counts={counts}
            total={guides.length}
          />
          {totalPages > 1 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Showing {rangeStart}-{rangeEnd} of {current.length}
              {safePage > 1 ? ` · Page ${safePage}` : ""}
            </p>
          ) : null}
        </div>
        <div className="w-full shrink-0 lg:max-w-xs">
          <Suspense
            fallback={
              <div className="h-11 animate-pulse rounded-full bg-paper-2" />
            }
          >
            <GuideSearch />
          </Suspense>
        </div>
      </div>

      <div id="guides-list" className="mt-10 scroll-mt-24 space-y-8">
        {hero ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
              This week
            </p>
            <GuideCard
              guide={hero}
              badge="Now"
              placement="guides_index_hero"
              variant="hero"
            />
          </div>
        ) : null}

        {gridGuides.length > 0 ? (
          <div>
            {hero ? (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Guides for right now
              </p>
            ) : null}
            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gridGuides.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  placement="guides_index"
                />
              ))}
            </div>
          </div>
        ) : null}

        {showPastShelf ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Past season
            </p>
            <p className="mb-4 max-w-2xl text-sm leading-6 text-ink-soft">
              Halloween, fall-break, and other dated pieces stay here until next
              year. Same URLs. Fresh when the calendar comes back around.
            </p>
            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pastSeason.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  placement="guides_index_past_season"
                />
              ))}
            </div>
          </div>
        ) : null}

        <GuidesPagination
          basePath="/guides"
          page={safePage}
          totalPages={totalPages}
        />

        <NewsletterSignupCard
          kicker="New guides"
          title="Sign up to stay informed"
          body="One email on Sunday when a new guide drops, plus the free grocery checklist to start the week."
          source="guides_index"
        />
      </div>
    </div>
  );
}
