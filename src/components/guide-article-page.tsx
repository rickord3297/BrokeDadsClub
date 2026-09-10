import Link from "next/link";
import { ActionBox } from "@/components/guide-action-box";
import { FieldChecklist } from "@/components/field-checklist";
import { GuideBreadcrumbs } from "@/components/guide-breadcrumbs";
import {
  GuideCompanionPrintables,
  GuidePrintableEmbed,
} from "@/components/guide-companion-tools";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { GuideFaqAccordion } from "@/components/guide-faq";
import { GuideFeedback } from "@/components/guide-feedback";
import { GuideKeepGoing } from "@/components/guide-keep-going";
import { GuideMarkdown } from "@/components/guide-markdown";
import { GuidePreviewBanner } from "@/components/guide-preview-banner";
import { GuideReaderSignal } from "@/components/guide-reader-signal";
import { GuideStickyBar } from "@/components/guide-sticky-bar";
import { GuideTableOfContents } from "@/components/guide-toc";
import { GuideThePoint } from "@/components/guide-the-point";
import { GuideViewTracker } from "@/components/guide-view-tracker";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareGuide } from "@/components/share-guide";
import { formatDate } from "@/lib/format";
import {
  extractTocHeadings,
  partitionGuideBody,
} from "@/lib/guide-content";
import type { Guide, GuidePreviewState } from "@/lib/guides";
import {
  getGuide,
  getGuideForPreview,
  guideKeywords,
  splitGuideIntro,
  toGuideListItem,
} from "@/lib/guides";
import type { GuideListItem } from "@/lib/guide-model";
import { getResourceByGuideSlug, otherResources } from "@/lib/resources";
import { OG_IMAGE } from "@/lib/seo";
import { site } from "@/lib/site";

type GuideArticlePageProps = {
  guide: Guide;
  related: Guide[];
  mode?: "public" | "preview";
  previewState?: GuidePreviewState;
};

export function GuideArticlePage({
  guide,
  related,
  mode = "public",
  previewState,
}: GuideArticlePageProps) {
  const isPreview = mode === "preview";
  const publicUrl = `${site.url}/guides/${guide.slug}`;
  const pageUrl = isPreview
    ? `${site.url}/preview/guides/${guide.slug}`
    : publicUrl;
  const keywords = guideKeywords(guide);
  const relatedItems: GuideListItem[] = related.map((item) =>
    toGuideListItem(item),
  );
  const nextGuide = guide.nextGuide
    ? isPreview
      ? getGuideForPreview(guide.nextGuide)
      : getGuide(guide.nextGuide)
    : null;
  const actionSteps = [guide.action].filter((step) => step.trim());
  const [intro, body] = splitGuideIntro(guide.content);
  const { fieldProtocol, main, thePoint } = partitionGuideBody(body);
  const headings = extractTocHeadings(main);
  const headingCounts = new Map<string, number>();
  const companionPrintable = getResourceByGuideSlug(guide.slug);
  const showToc = headings.length >= 2;
  const guidesIndexHref = isPreview ? "/preview/guides" : "/guides";
  const guideLinkBase = isPreview ? "/preview/guides" : "/guides";
  const topicHref = isPreview
    ? `/preview/guides?topic=${encodeURIComponent(guide.category)}`
    : `/guides?topic=${encodeURIComponent(guide.category)}`;

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
    image: `${site.url}${OG_IMAGE.url}`,
    mainEntityOfPage: pageUrl,
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
        name: isPreview ? "Guide preview" : "Guides",
        item: isPreview ? `${site.url}/preview/guides` : `${site.url}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.category,
        item: `${site.url}${topicHref}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: guide.title,
        item: pageUrl,
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
      {isPreview && previewState ? (
        <GuidePreviewBanner
          previewState={previewState}
          publishedAt={guide.publishedAt}
          liveHref={
            previewState === "published" || previewState === "live"
              ? `/guides/${guide.slug}`
              : undefined
          }
        />
      ) : null}

      {!isPreview ? (
        <GuideViewTracker slug={guide.slug} category={guide.category} />
      ) : null}
      <ReadingProgress slug={guide.slug} />
      {!isPreview ? (
        <GuideStickyBar title={guide.title} url={publicUrl} slug={guide.slug} />
      ) : null}

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {!isPreview ? (
          <>
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
          </>
        ) : null}

        <GuideBreadcrumbs category={guide.category} title={guide.title} />

        <div
          className={
            showToc
              ? "mt-8 lg:grid lg:grid-cols-[minmax(0,42rem)_13rem] lg:items-start lg:justify-between lg:gap-12"
              : "mt-8"
          }
        >
          <article data-reading-progress className="min-w-0 max-w-3xl pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
              {guide.category} · {guide.readTime}
              {isPreview && previewState ? (
                <span className="ml-2 rounded-full bg-rust/15 px-2 py-0.5 text-[10px] tracking-[0.12em] text-rust-2">
                  {previewState}
                </span>
              ) : null}
            </p>
            <GuideReaderSignal
              slug={guide.slug}
              publishedAt={guide.publishedAt}
            />
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              {guide.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
              <p className="text-sm text-ink-soft">
                <span className="font-medium text-ink">{site.name}</span>
                <span className="mx-2 text-rule">·</span>
                {formatDate(guide.publishedAt)}
              </p>
              {!isPreview ? (
                <ShareGuide
                  title={guide.title}
                  url={publicUrl}
                  slug={guide.slug}
                />
              ) : null}
            </div>

            <div className="prose-guide mt-8">
              <GuideMarkdown
                content={intro}
                headingCounts={headingCounts}
                currentSlug={guide.slug}
              />
            </div>

            {fieldProtocol ? (
              <FieldChecklist protocol={fieldProtocol} />
            ) : (
              <ActionBox steps={actionSteps} />
            )}

            {showToc ? (
              <GuideTableOfContents
                headings={headings}
                includeFaq={guide.faq.length > 0}
                includeKeepGoing={relatedItems.length > 0}
                variant="mobile"
              />
            ) : null}

            {main ? (
              <div className="prose-guide mt-8">
                <GuideMarkdown
                  content={main}
                  headingCounts={headingCounts}
                  currentSlug={guide.slug}
                />
              </div>
            ) : null}

            <GuideThePoint
              content={thePoint}
              headingCounts={headingCounts}
              currentSlug={guide.slug}
            />

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

            <GuideKeepGoing guides={relatedItems} linkBase={guideLinkBase} />

            {!isPreview ? (
              <GuideEmailCta
                source={`guide:${guide.slug}`}
                successHref={
                  nextGuide
                    ? `/guides/${nextGuide.slug}`
                    : "/resources/grocery-week-checklist"
                }
                successLinkLabel={
                  nextGuide
                    ? `Read next: ${nextGuide.title}`
                    : "Print the grocery checklist"
                }
              />
            ) : null}

            {!isPreview ? <GuideFeedback slug={guide.slug} /> : null}

            <p className="mt-10 border-t border-rule pt-6 text-sm">
              <Link href={guidesIndexHref} className="text-pine hover:text-rust">
                ← {isPreview ? "All previews" : "All guides"}
              </Link>
              <span className="mx-2 text-rule">·</span>
              <Link href={topicHref} className="text-pine hover:text-rust">
                More in {guide.category}
              </Link>
              {isPreview &&
              previewState &&
              (previewState === "published" || previewState === "live") ? (
                <>
                  <span className="mx-2 text-rule">·</span>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-pine hover:text-rust"
                  >
                    View live page
                  </Link>
                </>
              ) : null}
            </p>
          </article>

          {showToc ? (
            <aside className="hidden min-w-0 lg:block">
              <GuideTableOfContents
                headings={headings}
                includeFaq={guide.faq.length > 0}
                includeKeepGoing={relatedItems.length > 0}
                variant="desktop"
              />
            </aside>
          ) : null}
        </div>
      </div>
    </>
  );
}
