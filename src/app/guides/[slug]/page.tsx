import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GuideBreadcrumbs } from "@/components/guide-breadcrumbs";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { GuideViewTracker } from "@/components/guide-view-tracker";
import { ReadingProgress } from "@/components/reading-progress";
import { RelatedGuides } from "@/components/related-guides";
import { ShareGuide } from "@/components/share-guide";
import { formatDate } from "@/lib/format";
import {
  getGuide,
  getGuides,
  getRelatedGuides,
  guideKeywords,
  splitGuideContent,
} from "@/lib/guides";
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

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          const external = href.startsWith("http");
          return (
            <Link
              href={href}
              className="font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {children}
            </Link>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${site.url}/guides/${guide.slug}`;
  const keywords = guideKeywords(guide);
  const related = getRelatedGuides(guide);
  const [beforeCta, afterCta] = splitGuideContent(guide.content);
  const nextGuide = guide.nextGuide ? getGuide(guide.nextGuide) : null;

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
      <article
        data-reading-progress
        className="mx-auto max-w-3xl px-4 py-14 sm:px-6"
      >
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

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-rust">
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

        <div className="prose-guide mt-10">
          <Markdown content={beforeCta} />
        </div>

        <GuideEmailCta
          source={`guide:${guide.slug}`}
          successHref={
            nextGuide
              ? `/guides/${nextGuide.slug}`
              : "/resources/grocery-week-checklist"
          }
          successLinkLabel={
            nextGuide ? `Read next: ${nextGuide.title}` : "Print the grocery checklist"
          }
        />

        {afterCta ? (
          <div className="prose-guide">
            <Markdown content={afterCta} />
          </div>
        ) : null}

        {guide.faq.length > 0 ? (
          <section className="mt-12 border-t border-rule pt-8">
            <h2 className="font-display text-3xl">Quick answers</h2>
            <dl className="mt-6 space-y-5">
              {guide.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-display text-xl">{item.question}</dt>
                  <dd className="mt-2 text-base leading-7 text-ink-soft">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </article>
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <RelatedGuides guides={related} />
        <p className="mt-12 border-t border-rule pt-6 text-sm">
          <Link href="/guides" className="text-pine hover:text-rust">
            ← All guides
          </Link>
        </p>
      </div>
    </>
  );
}
