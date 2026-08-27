import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBox } from "@/components/guide-action-box";
import { GuideBreadcrumbs } from "@/components/guide-breadcrumbs";
import {
  GuideCompanionPrintables,
  GuidePrintableEmbed,
} from "@/components/guide-companion-tools";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { GuideFaqAccordion } from "@/components/guide-faq";
import { GuideKeepGoing } from "@/components/guide-keep-going";
import { GuideMarkdown } from "@/components/guide-markdown";
import { GuideTableOfContents } from "@/components/guide-toc";
import { GuideViewTracker } from "@/components/guide-view-tracker";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareGuide } from "@/components/share-guide";
import { StickyShareGuide } from "@/components/sticky-share-guide";
import { relatedGuideHook } from "@/lib/guide-catalog";
import { formatDate } from "@/lib/format";
import {
  extractGuideHeadings,
  getGuide,
  getGuides,
  getRelatedGuides,
  guideKeywords,
  splitGuideIntro,
  toGuideListItem,
} from "@/lib/guides";
import { getResourceByGuideSlug, otherResources } from "@/lib/resources";
import { site } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };

  const url = `${site.url}/guides/${guide.slug}`;
  const keywords = guideKeywords(guide);

  return {
    title: { absolute: guide.seoTitle },
    description: guide.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: guide.seoTitle,
      description: guide.description,
      url,
      siteName: site.name,
      publishedTime: guide.publishedAt,
      tags: keywords,
      images: ["/brand/club-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.description,
      images: ["/brand/club-logo.png"],
    },
  };
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${site.url}/guides/${guide.slug}`;
  const keywords = guideKeywords(guide);
  const relatedGuides = getRelatedGuides(guide, 4);
  const related = relatedGuides.map((item) => toGuideListItem(item));
  const nextRead = relatedGuides[0]
    ? {
        slug: relatedGuides[0].slug,
        title: relatedGuides[0].title,
        hook: relatedGuideHook(
          relatedGuides[0].slug,
          relatedGuides[0].category,
        ),
      }
    : null;
  const actionSteps = [
    guide.action,
    ...guide.takeaways,
  ].filter((step, index, all) => {
    const key = step.trim().toLowerCase();
    if (!key) return false;
    return all.findIndex((item) => item.trim().toLowerCase() === key) === index;
  });
  const [intro, body] = splitGuideIntro(guide.content);
  const headings = extractGuideHeadings(guide.content);
  const headingCounts = new Map<string, number>();
  const companionPrintable = getResourceByGuideSlug(guide.slug);
  const showToc = headings.length >= 2;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/club-logo.png`,
      },
    },
    mainEntityOfPage: url,
    keywords: keywords.join(", "),
    articleSection: guide.category,
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
        item: `${site.url}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.category,
        item: `${site.url}/guides?topic=${encodeURIComponent(guide.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: guide.title,
        item: url,
      },
    ],
  };

  const faqLd =
    guide.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <GuideViewTracker slug={guide.slug} category={guide.category} />
      <ReadingProgress slug={guide.slug} />
      <StickyShareGuide title={guide.title} url={url} slug={guide.slug} />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        ) : null}

        <GuideBreadcrumbs category={guide.category} title={guide.title} />

        <div
          className={
            showToc
              ? "mt-8 lg:grid lg:grid-cols-[minmax(0,42rem)_13rem] lg:items-start lg:justify-between lg:gap-12"
              : "mt-8"
          }
        >
          <article data-reading-progress className="min-w-0 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
              {guide.category} · {guide.readTime}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              {guide.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
              <p className="text-sm text-ink-soft">
                <span className="font-medium text-ink">{site.name}</span>
                <span className="mx-2 text-rule">·</span>
                {formatDate(guide.publishedAt)}
              </p>
              <ShareGuide title={guide.title} url={url} slug={guide.slug} />
            </div>

            {showToc ? (
              <GuideTableOfContents
                headings={headings}
                includeFaq={guide.faq.length > 0}
                includeKeepGoing={related.length > 0}
                variant="mobile"
              />
            ) : null}

            <div className="prose-guide mt-8">
              <GuideMarkdown content={intro} headingCounts={headingCounts} />
            </div>

            <ActionBox steps={actionSteps} nextRead={nextRead} />

            {companionPrintable ? (
              <GuidePrintableEmbed
                resource={companionPrintable}
                placement="inline"
              />
            ) : null}

            {body ? (
              <div className="prose-guide mt-8">
                <GuideMarkdown content={body} headingCounts={headingCounts} />
              </div>
            ) : null}

            <GuideEmailCta source={`guide:${guide.slug}`} />

            {guide.faq.length > 0 ? (
              <GuideFaqAccordion items={guide.faq} />
            ) : null}

            {companionPrintable ? (
              <GuidePrintableEmbed
                resource={companionPrintable}
                placement="bottom"
              />
            ) : null}

            <GuideCompanionPrintables
              printables={
                companionPrintable
                  ? otherResources(companionPrintable.slug)
                  : []
              }
            />

            <GuideKeepGoing guides={related} />

            <p className="mt-12 border-t border-rule pt-6 text-sm">
              <Link href="/guides" className="text-pine hover:text-rust">
                ← All guides
              </Link>
              <span className="mx-2 text-rule">·</span>
              <Link
                href={`/guides?topic=${encodeURIComponent(guide.category)}`}
                className="text-pine hover:text-rust"
              >
                More in {guide.category}
              </Link>
            </p>
          </article>

          {showToc ? (
            <aside className="hidden min-w-0 lg:block">
              <GuideTableOfContents
                headings={headings}
                includeFaq={guide.faq.length > 0}
                includeKeepGoing={related.length > 0}
                variant="desktop"
              />
            </aside>
          ) : null}
        </div>
      </div>
    </>
  );
}
