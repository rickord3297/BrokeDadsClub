import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { JsonLd } from "@/components/json-ld";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import { getLiveResources } from "@/lib/printables";
import {
  GUIDE_PILLARS,
  getGuidePillar,
  type GuidePillar,
  type GuideTopicSlug,
} from "@/lib/guide-pillars";
import { getGuides, toGuideListItem } from "@/lib/guides";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function pillarMetadata(slug: GuideTopicSlug): Metadata {
  const pillar = getGuidePillar(slug);
  if (!pillar) return { title: "Guides" };
  return buildPageMetadata({
    title: pillar.seoTitle,
    description: pillar.description,
    path: `/guides/${pillar.slug}`,
    keywords: pillar.keywords,
    absoluteTitle: true,
  });
}

export function GuidePillarPage({ slug }: { slug: GuideTopicSlug }) {
  const pillar = getGuidePillar(slug);
  if (!pillar) return null;
  const liveResources = getLiveResources();
  const path = `/guides/${pillar.slug}`;
  const url = absoluteUrl(path);

  const guides = getGuides()
    .filter((guide) => guide.category === pillar.category)
    .map((guide) => {
      const tieIn = resourceTieInForGuide(guide.slug, liveResources);
      return toGuideListItem(
        guide,
        tieIn ? { href: tieIn.href, label: tieIn.label } : null,
      );
    });

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pillar.title,
    description: pillar.description,
    url,
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
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

      <p className="mt-6 text-sm">
        <Link href="/guides" className="font-medium text-pine hover:text-rust">
          ← All guides
        </Link>
        {GUIDE_PILLARS.filter((item) => item.slug !== pillar.slug).map(
          (item) => (
            <span key={item.slug}>
              <span className="mx-2 text-ink-soft/40">·</span>
              <Link
                href={`/guides/${item.slug}`}
                className="font-medium text-ink-soft hover:text-pine"
              >
                {item.category}
              </Link>
            </span>
          ),
        )}
      </p>

      <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
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
    </div>
  );
}
