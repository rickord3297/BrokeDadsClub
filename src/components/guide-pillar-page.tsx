import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { GuidesPagination } from "@/components/guides-pagination";
import { GuidesTopicNav } from "@/components/guides-topic-nav";
import { JsonLd } from "@/components/json-ld";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import {
  GUIDES_PAGE_SIZE,
  paginateItems,
  parseGuidePage,
} from "@/lib/guide-pagination";
import { getLiveResources } from "@/lib/printables";
import {
  GUIDE_PILLARS,
  getGuidePillar,
  type GuideTopicSlug,
} from "@/lib/guide-pillars";
import { getGuides, toGuideListItem } from "@/lib/guides";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function pillarMetadata(
  slug: GuideTopicSlug,
  page = 1,
): Metadata {
  const pillar = getGuidePillar(slug);
  if (!pillar) return { title: "Guides" };

  if (page > 1) {
    const title = `${pillar.title} - Page ${page} · ${site.name}`;
    const canonical = absoluteUrl(`/guides/${pillar.slug}?page=${page}`);
    return {
      title: { absolute: title },
      description: pillar.description,
      keywords: pillar.keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description: pillar.description,
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
    title: pillar.seoTitle,
    description: pillar.description,
    path: `/guides/${pillar.slug}`,
    keywords: pillar.keywords,
    absoluteTitle: true,
  });
}

export function GuidePillarPage({
  slug,
  searchParams = {},
}: {
  slug: GuideTopicSlug;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const pillar = getGuidePillar(slug);
  if (!pillar) return null;
  const liveResources = getLiveResources();
  const path = `/guides/${pillar.slug}`;
  const url = absoluteUrl(path);
  const page = parseGuidePage(searchParams);

  const allGuides = getGuides();
  const guides = allGuides
    .filter((guide) => guide.category === pillar.category)
    .map((guide) => {
      const tieIn = resourceTieInForGuide(guide.slug, liveResources);
      return toGuideListItem(
        guide,
        tieIn ? { href: tieIn.href, label: tieIn.label } : null,
      );
    });

  const { page: safePage, totalPages, slice, total } = paginateItems(
    guides,
    page,
    GUIDES_PAGE_SIZE,
  );

  const categories = GUIDE_PILLARS.map((item) => item.category).filter(
    (category) => allGuides.some((guide) => guide.category === category),
  );
  const counts = Object.fromEntries(
    categories.map((category) => [
      category,
      allGuides.filter((guide) => guide.category === category).length,
    ]),
  );

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pillar.title,
    description: pillar.description,
    url: safePage > 1 ? `${url}?page=${safePage}` : url,
    numberOfItems: guides.length,
    itemListElement: slice.map((guide, index) => ({
      "@type": "ListItem",
      position: (safePage - 1) * GUIDES_PAGE_SIZE + index + 1,
      url: absoluteUrl(`/guides/${guide.slug}`),
      name: guide.title,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: absoluteUrl("/guides"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pillar.title,
        item: url,
      },
    ],
  };

  const rangeStart = total ? (safePage - 1) * GUIDES_PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(safePage * GUIDES_PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={[itemListLd, breadcrumbLd]} />
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="font-medium hover:text-pine">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-rule">
            /
          </li>
          <li>
            <Link href="/guides" className="font-medium hover:text-pine">
              Guides
            </Link>
          </li>
          <li aria-hidden className="text-rule">
            /
          </li>
          <li className="font-medium text-ink" aria-current="page">
            {pillar.category}
          </li>
        </ol>
      </nav>

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-rust">
        Guides · {pillar.category}
      </p>
      <h1 className="mt-3 font-display text-5xl">{pillar.title}</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-lg leading-8 text-ink-soft">
        {pillar.intro.length > 0 ? (
          pillar.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p>{pillar.description}</p>
        )}
      </div>

      <div className="mt-8">
        <GuidesTopicNav
          categories={categories}
          counts={counts}
          total={allGuides.length}
          activeCategory={pillar.category}
        />
        {totalPages > 1 ? (
          <p className="mt-3 text-sm text-ink-soft">
            Showing {rangeStart}-{rangeEnd} of {total}
            {safePage > 1 ? ` · Page ${safePage}` : ""}
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((guide) => (
          <GuideCard
            key={guide.slug}
            guide={guide}
            placement={`pillar_${pillar.slug}`}
          />
        ))}
      </div>

      {guides.length === 0 ? (
        <p className="mt-8 text-ink-soft">No live guides in this topic yet.</p>
      ) : null}

      <div className="mt-10">
        <GuidesPagination
          basePath={path}
          page={safePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
