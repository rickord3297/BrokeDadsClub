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
  type DealItem,
} from "@/lib/newsletter-model";
import { getScannedDeals } from "@/lib/scanned-deals";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = buildPageMetadata({
  title: "Dad Tax Deals",
  description:
    "Specific product picks with target prices, the money math, and a free club printable. Buy at or under the number.",
  path: "/deals",
  keywords: [
    "dad tax deals",
    "amazon deals for dads",
    "discounted family gear",
    "cheap dad gear",
    "broke dads club deals",
  ],
});

function DealList({ deals, keyPrefix }: { deals: DealItem[]; keyPrefix: string }) {
  if (deals.length === 0) return null;
  return (
    <ul className="mt-6 grid gap-4">
      {deals.map((deal) => (
        <li key={`${keyPrefix}-${deal.asin ?? deal.title}-${deal.url}`}>
          <DealCard deal={deal} variant="row" />
        </li>
      ))}
    </ul>
  );
}

export default async function DealsPage() {
  const [scannedDeals, board, dispatch] = await Promise.all([
    getScannedDeals(18),
    Promise.resolve(getDealsBoard()),
    Promise.resolve(getLatestDispatchDeals()),
  ]);

  const boardDeals = board?.deals ?? [];
  const seasonal = boardDeals.filter((deal) => deal.section === "seasonal");
  const always = boardDeals.filter(
    (deal) => deal.section === "always" || deal.section == null,
  );
  const house = boardDeals.filter((deal) => deal.section === "house");
  const onSaleBoard = boardDeals.filter(dealHasDiscount);
  const liveOnSale = [...scannedDeals, ...onSaleBoard];
  const hasLivePrices = scannedDeals.length > 0 || onSaleBoard.length > 0;

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
  const seasonalLabel =
    seasonal.find((deal) => deal.sectionLabel)?.sectionLabel ??
    "This week · seasonal";
  const alwaysLabel =
    always.find((deal) => deal.sectionLabel)?.sectionLabel ??
    "Always worth having";

  const itemListLd =
    boardDeals.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: board?.title ?? "Dad tax deals",
          itemListElement: boardDeals.slice(0, 20).map((deal, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: deal.title,
            url: deal.url.startsWith("http") ? deal.url : absoluteUrl(deal.url),
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
        One product per card, linked straight to the listing. Target prices are
        what we would pay. Above the number, wait.
      </p>
      {board?.updatedAt ? (
        <p className="mt-3 text-sm text-ink-soft">
          Watchlist updated {formatDate(board.updatedAt)}
          {hasLivePrices ? " · Live scan refreshes twice a day" : ""}
        </p>
      ) : null}

      {hasLivePrices ? (
        <section aria-labelledby="on-sale-now" className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            Live scan
          </p>
          <h2 id="on-sale-now" className="mt-2 font-display text-3xl">
            On sale now
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Items Amazon is already marking down. Sorted by percent off.
          </p>
          <DealList deals={liveOnSale} keyPrefix="sale" />
        </section>
      ) : scanReady ? (
        <p className="mt-10 rounded-2xl border border-rule bg-paper-2/60 px-5 py-6 text-sm leading-6 text-ink-soft">
          No live markdowns in the latest scan. Next run is 8 a.m. or 2 p.m.
          Central. The watchlist below still stands.
        </p>
      ) : null}

      {seasonal.length > 0 ? (
        <section aria-labelledby="seasonal-deals" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Seasonal
          </p>
          <h2 id="seasonal-deals" className="mt-2 font-display text-3xl">
            {seasonalLabel}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Time-boxed picks. After the holiday, ignore these and keep the
            always list.
          </p>
          <DealList deals={seasonal} keyPrefix="seasonal" />
        </section>
      ) : null}

      {always.length > 0 ? (
        <section aria-labelledby="always-deals" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            Year-round
          </p>
          <h2 id="always-deals" className="mt-2 font-display text-3xl">
            {alwaysLabel}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {board?.intro ??
              "Buy at or under the target. These stay useful after the holiday cart clears."}
          </p>
          <DealList deals={always} keyPrefix="always" />
        </section>
      ) : null}

      {house.length > 0 ? (
        <section aria-labelledby="house-deals" className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            From the club
          </p>
          <h2 id="house-deals" className="mt-2 font-display text-3xl">
            Free from us
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            No affiliate cut. Our printables and grocery list keep more of the
            value in your kitchen.
          </p>
          <DealList deals={house} keyPrefix="house" />
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
          <DealList deals={dispatchOnly.deals} keyPrefix="dispatch" />
        </section>
      ) : null}

      <div className="mt-12">
        <InlineEmailBar
          embedded
          source="deals_watchlist_alerts"
          title="Email me when these drop below target"
          body="Join the Sunday list. When a watchlist item hits the target, we call it out in the Dispatch and link back here. Same list also brings the free grocery checklist."
          submitLabel="Watch the list"
        />
      </div>

      <p className="mt-10 text-xs leading-5 text-ink-soft">
        {hasLivePrices
          ? "Live prices are a snapshot from Amazon's catalog API and can change before you check out."
          : "Target prices are our guidance. Check Amazon for the current price."}{" "}
        {disclosures.length > 0 ? `${disclosures.join(" ")} ` : null}
        See our{" "}
        <Link
          href="/terms#affiliate-disclosure"
          className="underline hover:text-rust"
        >
          affiliate disclosure
        </Link>
        .
      </p>
    </div>
  );
}
