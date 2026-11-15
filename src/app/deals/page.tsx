import type { Metadata } from "next";
import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { JsonLd } from "@/components/json-ld";
import {
  getDealsBoard,
  getLatestDispatchDeals,
} from "@/lib/deals";
import { formatDate } from "@/lib/format";
import {
  dealDisclosures,
  formatIssueNumber,
} from "@/lib/newsletter-model";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Dad Tax Deals",
  description:
    "Curated dad tax offsets with target prices. Buy at or under the number. Affiliate links included at no extra cost to you.",
  path: "/deals",
  keywords: [
    "dad tax deals",
    "cheap dad gear",
    "family budget deals",
    "amazon deals for dads",
    "broke dads club deals",
  ],
});

export default function DealsPage() {
  const board = getDealsBoard();
  const dispatch = getLatestDispatchDeals();
  const boardDeals = board?.deals ?? [];
  const boardUrls = new Set(boardDeals.map((deal) => deal.url));
  const dispatchOnly =
    dispatch == null
      ? null
      : {
          ...dispatch,
          deals: dispatch.deals.filter((deal) => !boardUrls.has(deal.url)),
        };
  const disclosures = dealDisclosures([
    ...boardDeals,
    ...(dispatchOnly?.deals ?? []),
  ]);

  const itemListLd =
    boardDeals.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: board?.title ?? "Dad tax deals",
          itemListElement: boardDeals.map((deal, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: deal.title,
            url: deal.url,
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {itemListLd ? <JsonLd data={itemListLd} /> : null}

      <p className="text-xs uppercase tracking-[0.18em] text-rust">Deals</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        {board?.title ?? "Dad tax offsets"}
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-soft">
        {board?.intro ??
          "Curated finds that offset the small kid costs stacking every week. Buy at or under the target. Above it, wait."}
      </p>
      {board?.updatedAt ? (
        <p className="mt-3 text-sm text-ink-soft">
          Updated {formatDate(board.updatedAt)}
        </p>
      ) : null}

      {boardDeals.length > 0 ? (
        <ul className="mt-10 grid gap-4">
          {boardDeals.map((deal) => (
            <li key={`${deal.title}-${deal.url}`}>
              <DealCard deal={deal} variant="row" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-rule bg-paper-2/60 px-5 py-6 text-sm leading-6 text-ink-soft">
          No live board deals yet. Check this week&apos;s{" "}
          <Link href="/newsletter" className="font-medium text-pine hover:text-rust">
            Sunday Dispatch
          </Link>{" "}
          or check back soon.
        </p>
      )}

      {dispatchOnly && dispatchOnly.deals.length > 0 ? (
        <section aria-labelledby="dispatch-deals" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            From the Sunday Dispatch
          </p>
          <h2 id="dispatch-deals" className="mt-2 font-display text-3xl">
            {formatIssueNumber(dispatchOnly.issueNumber)}:{" "}
            {dispatchOnly.issueTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Published {formatDate(dispatchOnly.publishedAt)}.{" "}
            <Link
              href={`/newsletter/${dispatchOnly.issueSlug}`}
              className="font-medium text-pine hover:text-rust"
            >
              Read the issue →
            </Link>
          </p>
          <ul className="mt-6 grid gap-4">
            {dispatchOnly.deals.map((deal) => (
              <li key={`dispatch-${deal.title}-${deal.url}`}>
                <DealCard deal={deal} variant="row" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {disclosures.length > 0 ? (
        <p className="mt-10 text-xs leading-5 text-ink-soft">
          Target prices are what we would pay on the day we checked, not a live
          ticker. {disclosures.join(" ")} See our{" "}
          <Link href="/terms#affiliate-disclosure" className="underline hover:text-rust">
            affiliate disclosure
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-12">
        <InlineEmailBar
          embedded
          source="deals_page"
          title="Get deals in the Sunday email"
          body={`${site.weekStart.body}`}
        />
      </div>
    </div>
  );
}
