import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { JsonLd } from "@/components/json-ld";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import {
  GUIDE_PILLARS,
  getGuidePillar,
  type GuidePillar,
} from "@/lib/guide-pillars";
import { getGuides, toGuideListItem } from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function pillarMetadata(slug: GuidePillar["slug"]): Metadata {
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

export function GuidePillarPage({ slug }: { slug: GuidePillar["slug"] }) {
  const pillar = getGuidePillar(slug);
  if (!pillar) return null;

  const guides = getGuides()
    .filter((guide) => guide.category === pillar.category)
    .map((guide) => {
      const tieIn = resourceTieInForGuide(guide.slug);
      return toGuideListItem(
        guide,
        tieIn ? { href: tieIn.href, label: tieIn.label } : null,
      );
    });

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pillar.title,
    description: pillar.description,
    url: `${site.url}/guides/${pillar.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/guides/${guide.slug}`,
        name: guide.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={collectionLd} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">
        Guides · {pillar.category}
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
        {pillar.headline}
      </h1>
      <div className="prose-guide mt-6 max-w-3xl">
        {pillar.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/guides" className="font-medium text-pine hover:text-rust">
          ← All guides
        </Link>
        {GUIDE_PILLARS.filter((item) => item.slug !== pillar.slug).map(
          (item) => (
            <Link
              key={item.slug}
              href={`/guides/${item.slug}`}
              className="font-medium text-ink-soft hover:text-pine"
            >
              {item.category}
            </Link>
          ),
        )}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
