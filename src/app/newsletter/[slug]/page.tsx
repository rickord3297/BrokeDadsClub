import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideMarkdown } from "@/components/guide-markdown";
import { JsonLd } from "@/components/json-ld";
import { NewsletterDeals } from "@/components/newsletter-deals";
import { NewsletterSignupCard } from "@/components/newsletter-signup-card";
import { getGuide, type Guide } from "@/lib/guides";
import {
  formatIssueDate,
  formatIssueNumber,
  getAdjacentIssues,
  getAllIssues,
  getIssueBySlug,
  type WhatYouMissedItem,
  type WhatYouMissedType,
} from "@/lib/newsletter";
import { NOINDEX, absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;
/** Lets an issue dated in the future render on its Sunday without a redeploy. */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllIssues().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/newsletter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return { title: "Dispatch not found", ...NOINDEX };

  const base = buildPageMetadata({
    title: `${issue.title} (Sunday Dispatch ${formatIssueNumber(issue.issueNumber).replace("Issue ", "")})`,
    description: issue.excerpt,
    path: `/newsletter/${issue.slug}`,
    openGraphType: "article",
  });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: issue.publishedAt },
  };
}

export default async function NewsletterIssuePage({
  params,
}: PageProps<"/newsletter/[slug]">) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const { newer, older } = getAdjacentIssues(issue);
  const featuredGuide = issue.featuredGuideSlug ? getGuide(issue.featuredGuideSlug) : null;
  const url = absoluteUrl(`/newsletter/${issue.slug}`);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.title,
    description: issue.excerpt,
    datePublished: issue.publishedAt,
    url,
    mainEntityOfPage: url,
    isPartOf: { "@type": "Periodical", name: "The Sunday Dispatch", url: absoluteUrl("/newsletter") },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd data={articleLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/newsletter" className="font-medium text-pine hover:text-rust">
          <span aria-hidden>← </span>Back to all dispatches
        </Link>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
            {formatIssueNumber(issue.issueNumber)}
          </span>
          <time dateTime={issue.publishedAt} className="text-xs font-medium text-ink-soft">
            {formatIssueDate(issue.publishedAt)}
          </time>
          <span aria-hidden className="text-xs text-ink-soft">·</span>
          <span className="text-xs font-medium text-ink-soft">{issue.readTime} read</span>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{issue.title}</h1>
        <p className="mt-4 text-lg leading-8 text-ink-soft">{issue.excerpt}</p>
      </header>

      <p
        role="note"
        className="mt-6 flex gap-2 rounded-lg border border-rule bg-paper-2/60 px-4 py-3 text-sm leading-6 text-ink-soft"
      >
        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
        <span>
          Deals and target prices reflect the date of publication and may expire or
          change.
        </span>
      </p>

      <section aria-labelledby="sunday-note" className="mt-10">
        <SectionHeading id="sunday-note" eyebrow="01 · This week" title="The Sunday Note" />
        <div className="prose-guide mt-4">
          <GuideMarkdown
            content={issue.content}
            externalLinkRel="noopener noreferrer nofollow"
          />
        </div>
      </section>

      {featuredGuide || issue.whatYouMissed.length > 0 ? (
        <section aria-labelledby="what-you-missed" className="mt-12">
          <SectionHeading
            id="what-you-missed"
            eyebrow="02 · Around the site"
            title="What You Missed This Week"
          />
          <div className="mt-5 space-y-4">
            {featuredGuide ? (
              <FeaturedGuideCard guide={featuredGuide} note={issue.featuredGuideNote} />
            ) : null}
            {issue.whatYouMissed.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {issue.whatYouMissed.map((item) => (
                  <li key={item.href}>
                    <WhatYouMissedCard item={item} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {issue.deals.length > 0 ? (
        <div className="mt-12">
          <NewsletterDeals
            deals={issue.deals}
            headingId="issue-deals"
            variant="callout"
            eyebrow="03 · Deals"
            heading="Dad Tax Offsets"
          />
        </div>
      ) : null}

      {newer || older ? (
        <nav
          aria-label="More dispatches"
          className="mt-12 grid gap-3 border-t border-rule pt-6 sm:grid-cols-2"
        >
          {older ? (
            <Link href={`/newsletter/${older.slug}`} className="group rounded-xl border border-rule p-4 transition hover:border-pine">
              <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">← Older</span>
              <span className="mt-1 block font-display text-lg leading-snug group-hover:text-rust">
                {older.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {newer ? (
            <Link href={`/newsletter/${newer.slug}`} className="group rounded-xl border border-rule p-4 text-right transition hover:border-pine">
              <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">Newer →</span>
              <span className="mt-1 block font-display text-lg leading-snug group-hover:text-rust">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <div className="mt-12">
        <NewsletterSignupCard
          kicker="04 · Sunday Dispatch"
          title="Sign up to stay informed"
          body="One email every Sunday at 9am Central: a guide breakdown, real dad math, and 3 vetted deals."
          source="newsletter_issue"
          headingLevel="h2"
          showArchiveLink={false}
        />
      </div>
    </article>
  );
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">{eyebrow}</p>
      <h2 id={id} className="mt-1 font-display text-2xl leading-snug sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function FeaturedGuideCard({ guide, note }: { guide: Guide; note: string }) {
  const href = `/guides/${guide.slug}`;
  return (
    <article className="relative overflow-hidden rounded-2xl border border-rule bg-paper p-5 shadow-md shadow-ink/5 ring-1 ring-ink/5 sm:p-6">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-pine" aria-hidden />
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-pine px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-paper">
          Featured guide
        </span>
        <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
          {guide.category}
        </span>
        <span className="text-xs font-medium text-ink-soft">{guide.readTime}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight">
        <Link href={href} className="transition hover:text-rust">
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 text-base leading-7 text-ink-soft">{note || guide.excerpt}</p>
      {guide.takeaways.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink">
          {guide.takeaways.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={href}
        className="mt-5 inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2"
      >
        Read the guide<span className="sr-only">: {guide.title}</span>
      </Link>
    </article>
  );
}

const MISSED_TYPE_META: Record<WhatYouMissedType, { label: string; cta: string }> = {
  guide: { label: "Guide", cta: "Read the guide" },
  printable: { label: "Printable", cta: "Get the printable" },
  shop: { label: "Shop drop", cta: "View in shop" },
};

function WhatYouMissedCard({ item }: { item: WhatYouMissedItem }) {
  const meta = MISSED_TYPE_META[item.type];
  const external = /^https?:\/\//.test(item.href);
  const buttonClass =
    "mt-4 inline-flex h-9 items-center self-start rounded-full border border-pine px-4 text-sm font-semibold text-pine transition hover:bg-pine hover:text-paper";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-paper-2/60 p-5">
      <span className="self-start rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
        {meta.label}
      </span>
      <h3 className="mt-3 font-display text-xl leading-snug">{item.title}</h3>
      {item.description ? (
        <p className="mt-1.5 flex-1 text-sm leading-6 text-ink-soft">{item.description}</p>
      ) : null}
      {external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          {meta.cta}
          <span className="sr-only">: {item.title} (opens in a new tab)</span>
        </a>
      ) : (
        <Link href={item.href} className={buttonClass}>
          {meta.cta}
          <span className="sr-only">: {item.title}</span>
        </Link>
      )}
    </article>
  );
}
