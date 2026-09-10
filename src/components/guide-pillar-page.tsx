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
      <h1 className="mt-3 font-display text-5xl">{pillar.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        {pillar.description}
      </p>

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
