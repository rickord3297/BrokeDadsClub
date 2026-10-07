import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { NewsletterDeals } from "@/components/newsletter-deals";
import { NewsletterSignupCard } from "@/components/newsletter-signup-card";
import {
  formatIssueDate,
  formatIssueNumber,
  getNewsletterIssues,
  type NewsletterIssue,
} from "@/lib/newsletter";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "The Sunday Dispatch Archive: Weekly Dad Math and Deals",
  description:
    "Every past issue of the Sunday Dispatch: one guide breakdown, real dad math, and 3 vetted deals that offset the dad tax. No spam, no hustle-bro advice.",
  path: "/newsletter",
  keywords: [
    "dad newsletter",
    "sunday newsletter for dads",
    "frugal dad newsletter",
    "family budget newsletter",
    "dad tax deals",
  ],
});

export default function NewsletterPage() {
  const issues = getNewsletterIssues();
  const [latest, ...archive] = issues;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Sunday Dispatch archive",
    itemListElement: issues.map((issue, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/newsletter/${issue.slug}`),
      name: `${formatIssueNumber(issue.issueNumber)}: ${issue.title}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      {issues.length > 0 ? <JsonLd data={itemListLd} /> : null}

      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-rust">Sunday Dispatch</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">
          The Sunday Dispatch Archive
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
          One email every Sunday: a guide breakdown, real dad math, and 3 vetted deals
          that offset the dad tax. No spam, no hustle-bro advice.
        </p>
      </header>

      <div className="mt-8">
        <NewsletterSignupCard
          id="subscribe"
          kicker="Sunday email"
          title="Get the next dispatch"
          body="Lands every Sunday at 9am Central, plus the free grocery checklist to start the week."
          source="newsletter_index"
          headingLevel="h2"
        />
      </div>

      {latest ? (
        <section aria-labelledby="latest-issue" className="mt-12">
          <h2
            id="latest-issue"
            className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pine"
          >
            Latest dispatch
          </h2>
          <LatestIssueCard issue={latest} />
        </section>
      ) : (
        <p className="mt-12 text-base text-ink-soft">
          The first dispatch goes out this Sunday. Sign up above and it lands in your inbox.
        </p>
      )}

      {archive.length > 0 ? (
        <section aria-labelledby="past-issues" className="mt-12">
          <h2
            id="past-issues"
            className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft"
          >
            Past dispatches
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {archive.map((issue) => (
              <li key={issue.slug}>
                <ArchiveIssueCard issue={issue} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function IssueMeta({ issue }: { issue: NewsletterIssue }) {
  return (
    <>
      <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
        {formatIssueNumber(issue.issueNumber)}
      </span>
      <time dateTime={issue.publishedAt} className="text-xs font-medium text-ink-soft">
        {formatIssueDate(issue.publishedAt)}
      </time>
    </>
  );
}

function LatestIssueCard({ issue }: { issue: NewsletterIssue }) {
  const href = `/newsletter/${issue.slug}`;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-pine" aria-hidden />
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pine px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-paper">
              New
            </span>
            <IssueMeta issue={issue} />
          </div>
          <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            <Link href={href} className="transition hover:text-rust">
              {issue.title}
            </Link>
          </h3>
          <p className="mt-3 text-base leading-7 text-ink-soft">{issue.excerpt}</p>
          {issue.takeaways.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-sm leading-6 text-ink">
              {issue.takeaways.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-6 flex flex-1 items-end">
            <Link
              href={href}
              className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2"
            >
              Read dispatch
              <span className="sr-only">: {issue.title}</span>
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-paper-2/70 p-4 sm:p-5">
          <NewsletterDeals
            deals={issue.deals.slice(0, 3)}
            headingId={`deals-${issue.slug}`}
          />
        </div>
      </div>
    </article>
  );
}

function ArchiveIssueCard({ issue }: { issue: NewsletterIssue }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:border-pine hover:shadow-lg hover:shadow-pine/10">
      <div className="absolute inset-y-0 left-0 w-1 bg-pine" aria-hidden />
      <Link href={`/newsletter/${issue.slug}`} className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-rule bg-paper-2/80 px-5 py-3 pl-6">
          <IssueMeta issue={issue} />
        </div>
        <div className="flex flex-1 flex-col p-5 pl-6">
          <h3 className="font-display text-2xl leading-tight group-hover:text-rust">
            {issue.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{issue.excerpt}</p>
          <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-rule/80 pt-4">
            <p className="text-xs text-ink-soft/80">
              {issue.deals.length} {issue.deals.length === 1 ? "deal" : "deals"}
            </p>
            <span className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition group-hover:bg-pine-2">
              Read dispatch
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
