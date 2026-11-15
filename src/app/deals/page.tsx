import type { Metadata } from "next";
import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { JsonLd } from "@/components/json-ld";
import { isAmazonCreatorsConfigured } from "@/lib/amazon-creators";
import {
  getDealsBoard,
  getLatestDispatchDeals,
} from "@/lib/deals";
import { formatDate } from "@/lib/format";
import {
  dealDisclosures,
  dealHasDiscount,
  formatIssueNumber,
} from "@/lib/newsletter-model";
import { getScannedDeals } from "@/lib/scanned-deals";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 1800;

export const metadata: Metadata = buildPageMetadata({
  title: "Dad Tax Deals",
  description:
    "Live Amazon markdowns and curated dad tax offsets. We surface real discounts when we can, then target-price watches for the rest.",
  path: "/deals",
  keywords: [
    "dad tax deals",
    "amazon deals for dads",
    "discounted family gear",
    "cheap dad gear",
    "broke dads club deals",
  ],
});

export default async function DealsPage() {
  const [scannedDeals, board, dispatch] = await Promise.all([
    getScannedDeals(18),
    Promise.resolve(getDealsBoard()),
    Promise.resolve(getLatestDispatchDeals()),
  ]);

  const boardDeals = board?.deals ?? [];
  const onSaleBoard = boardDeals.filter(dealHasDiscount);
  const watchBoard = boardDeals.filter((deal) => !dealHasDiscount(deal));
  const scannedAsins = new Set(
    scannedDeals.map((deal) => deal.asin).filter(Boolean) as string[],
  );
  const boardUrls = new Set(boardDeals.map((deal) => deal.url));
  const dispatchOnly =
    dispatch == null
      ? null
      : {
          ...dispatch,
          deals: dispatch.deals.filter(
            (deal) =>
              !boardUrls.has(deal.url) &&
              !(deal.asin && scannedAsins.has(deal.asin)),
          ),
        };

  const disclosures = dealDisclosures([
    ...scannedDeals,
    ...boardDeals,
    ...(dispatchOnly?.deals ?? []),
  ]);
  const scanReady = isAmazonCreatorsConfigured();

  const itemListLd =
    scannedDeals.length + onSaleBoard.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Dad tax deals on sale",
          itemListElement: [...scannedDeals, ...onSaleBoard]
            .slice(0, 20)
            .map((deal, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: deal.title,
              url: absoluteUrl("/deals"),
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
        We scan Amazon for real markdowns on dad-household gear, then keep a
        short watchlist with target prices. Buy at or under the number. Above
        it, wait.
      </p>
      {board?.updatedAt ? (
        <p className="mt-3 text-sm text-ink-soft">
          Watchlist updated {formatDate(board.updatedAt)}
          {scannedDeals[0] ? " · Live scan refreshes twice a day" : ""}
        </p>
      ) : null}

      <section aria-labelledby="on-sale-now" className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
          Live scan
        </p>
        <h2 id="on-sale-now" className="mt-2 font-display text-3xl">
          On sale now
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Items Amazon is already marking down (list/was price vs buy box).
          Sorted by percent off.
        </p>

        {scannedDeals.length > 0 || onSaleBoard.length > 0 ? (
          <ul className="mt-6 grid gap-4">
            {[...scannedDeals, ...onSaleBoard].map((deal) => (
              <li key={`sale-${deal.asin ?? deal.title}-${deal.url}`}>
                <DealCard deal={deal} variant="row" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-2xl border border-rule bg-paper-2/60 px-5 py-6 text-sm leading-6 text-ink-soft">
            {scanReady
              ? "No live markdowns in the latest scan. The next run is at 8 a.m. or 2 p.m. Central."
              : "Live discount scanning needs Amazon Creators API credentials in Vercel (and 10 Associates sales in the last 30 days). Until then, use the watchlist below."}
          </p>
        )}
      </section>

      {watchBoard.length > 0 ? (
        <section aria-labelledby="watchlist" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Watchlist
          </p>
          <h2 id="watchlist" className="mt-2 font-display text-3xl">
            Worth buying at the target
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {board?.intro ??
              "No live strikethrough yet. Buy only at or under the target."}
          </p>
          <ul className="mt-6 grid gap-4">
            {watchBoard.map((deal) => (
              <li key={`watch-${deal.title}-${deal.url}`}>
                <DealCard deal={deal} variant="row" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
          Live prices are a snapshot from Amazon&apos;s catalog API and can
          change before you check out. {disclosures.join(" ")} See our{" "}
          <Link
            href="/terms#affiliate-disclosure"
            className="underline hover:text-rust"
          >
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
          body={site.weekStart.body}
        />
      </div>
    </div>
  );
}
