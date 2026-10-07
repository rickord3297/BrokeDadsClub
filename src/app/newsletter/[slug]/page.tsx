import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideMarkdown } from "@/components/guide-markdown";
import { JsonLd } from "@/components/json-ld";
import { NewsletterDeals } from "@/components/newsletter-deals";
import { NewsletterSignupCard } from "@/components/newsletter-signup-card";
import {
  formatIssueDate,
  formatIssueNumber,
  getAdjacentIssues,
  getAllIssues,
  getIssueBySlug,
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
          <span aria-hidden>← </span>All Dispatches
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
          Prices and deals reflect the date of publication and may expire or change.
        </span>
      </p>

      {issue.takeaways.length > 0 ? (
        <section
          aria-labelledby="issue-takeaways"
          className="mt-8 rounded-2xl border border-rule bg-paper-2/70 p-5 sm:p-6"
        >
          <h2
            id="issue-takeaways"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-pine"
          >
            The short version
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink">
            {issue.takeaways.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="prose-guide mt-8">
        <GuideMarkdown content={issue.content} />
      </div>

      <div className="mt-12">
        <NewsletterDeals deals={issue.deals} headingId="issue-deals" variant="callout" />
      </div>

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
          kicker="Sunday email"
          title="Get the next one in your inbox"
          body="One email every Sunday at 9am Central. A guide breakdown, real dad math, and 3 vetted deals."
          source="newsletter_issue"
          headingLevel="h2"
          showArchiveLink={false}
        />
      </div>
    </article>
  );
}
