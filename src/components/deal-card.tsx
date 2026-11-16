"use client";

import Image from "next/image";
import Link from "next/link";
import { AFFILIATE_CONFIG, type ApprovedMerchant } from "@/lib/affiliate";
import { trackDealClick } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import {
  dealHasDiscount,
  formatDealDiscountLabel,
  formatTargetPrice,
  type DealItem,
} from "@/lib/newsletter-model";

/** Google asks for "sponsored" on paid/affiliate links; "nofollow" covers crawlers that ignore it. */
export const DEAL_LINK_REL = "noopener noreferrer nofollow sponsored";

function MerchantBadge({ merchant }: { merchant: ApprovedMerchant }) {
  return (
    <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
      {AFFILIATE_CONFIG[merchant].name}
    </span>
  );
}

function DiscountBadge({ deal }: { deal: DealItem }) {
  const label = formatDealDiscountLabel(deal);
  if (!label) return null;
  return (
    <p className="mt-2 text-sm font-semibold text-pine">
      <span className="rounded-full bg-pine/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-pine">
        On sale
      </span>{" "}
      <span className="ml-1">{label}</span>
    </p>
  );
}

function isInternalDeal(deal: DealItem): boolean {
  return deal.merchant === "house" || deal.url.startsWith("/");
}

function internalHref(deal: DealItem): string {
  if (deal.url.startsWith("/")) return deal.url;
  try {
    const parsed = new URL(deal.url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return deal.url;
  }
}

/**
 * One curated deal. "row" is the full-width deal-page layout; "compact" stacks
 * on the homepage. Lists show the merchant disclosure once below the cards;
 * pass `showDisclosure` when a card stands alone.
 */
export function DealCard({
  deal,
  variant = "row",
  showDisclosure = false,
}: {
  deal: DealItem;
  variant?: "row" | "compact";
  showDisclosure?: boolean;
}) {
  const { name: merchant, disclosure } = AFFILIATE_CONFIG[deal.merchant];
  const onSale = dealHasDiscount(deal);
  const internal = isInternalDeal(deal);
  const disclosureLine =
    showDisclosure && disclosure ? (
      <p className="mt-3 text-xs leading-5 text-ink-soft/80">{disclosure}</p>
    ) : null;
  const nearButtonDisclosure =
    !internal && disclosure ? (
      <p className="mt-2 text-[11px] leading-4 text-ink-soft/80">{disclosure}</p>
    ) : null;
  const srLabel = (
    <span className="sr-only">
      {" "}
      {internal ? `on ${merchant}` : `at ${merchant}`} for {deal.title}
      {internal ? "" : " (opens in a new tab)"}
    </span>
  );

  function onCheckPrice() {
    trackDealClick({
      title: deal.title,
      merchant: deal.merchant,
      section: deal.section,
      asin: deal.asin,
    });
  }

  const ctaLabel = internal ? "Get it free" : "Check price";
  const ctaClass =
    "inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2";

  const cta = internal ? (
    <Link href={internalHref(deal)} className={ctaClass} onClick={onCheckPrice}>
      {ctaLabel}
      {srLabel}
      <span aria-hidden className="ml-1">
        →
      </span>
    </Link>
  ) : (
    <a
      href={deal.url}
      target="_blank"
      rel={DEAL_LINK_REL}
      className={ctaClass}
      onClick={onCheckPrice}
    >
      {ctaLabel}
      {srLabel}
      <span aria-hidden className="ml-1">
        →
      </span>
    </a>
  );

  const compactCta = internal ? (
    <Link
      href={internalHref(deal)}
      onClick={onCheckPrice}
      className="mt-3 text-sm font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
    >
      {ctaLabel}
      {srLabel} <span aria-hidden>→</span>
    </Link>
  ) : (
    <a
      href={deal.url}
      target="_blank"
      rel={DEAL_LINK_REL}
      onClick={onCheckPrice}
      className="mt-3 text-sm font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
    >
      {ctaLabel}
      {srLabel} <span aria-hidden>→</span>
    </a>
  );

  const image = deal.imageUrl ? (
    <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-rule bg-paper sm:mx-0">
      <Image
        src={deal.imageUrl}
        alt=""
        width={160}
        height={160}
        className="h-full w-full object-contain p-2"
      />
    </div>
  ) : null;

  if (variant === "compact") {
    return (
      <article className="flex h-full flex-col rounded-xl border border-rule bg-paper p-4">
        <div className="flex items-start justify-between gap-3">
          <MerchantBadge merchant={deal.merchant} />
          <p className="text-right text-xs leading-4 text-ink-soft">
            {onSale ? "Now" : "Target price"}
            <span className="block font-display text-xl leading-6 text-ink">
              {formatTargetPrice(deal.price ?? deal.targetPrice)}
            </span>
          </p>
        </div>
        {image ? <div className="mt-3">{image}</div> : null}
        <h4 className="mt-2 font-semibold leading-snug text-ink">{deal.title}</h4>
        <DiscountBadge deal={deal} />
        {deal.math ? (
          <p className="mt-1.5 text-sm font-medium leading-6 text-pine">{deal.math}</p>
        ) : null}
        {deal.note ? (
          <p className="mt-1.5 flex-1 text-sm leading-6 text-ink-soft">{deal.note}</p>
        ) : null}
        {compactCta}
        {nearButtonDisclosure}
        {disclosureLine}
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-rule bg-paper p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
        {image}
        <div className="min-w-0 flex-1">
          <MerchantBadge merchant={deal.merchant} />
          <h3 className="mt-3 font-display text-xl leading-snug text-ink">
            {deal.title}
          </h3>
          <DiscountBadge deal={deal} />
          <p className="mt-1 text-sm font-semibold text-pine">
            {onSale
              ? `Now: ${formatTargetPrice(deal.price ?? deal.targetPrice)}`
              : `Target price: ${formatTargetPrice(deal.targetPrice)}`}
          </p>
          {deal.math ? (
            <p className="mt-2 text-sm font-medium leading-6 text-pine">{deal.math}</p>
          ) : null}
          {deal.note ? (
            <p className="mt-2 text-sm leading-6 text-ink-soft">{deal.note}</p>
          ) : null}
          {deal.whyThis ? (
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              <span className="font-semibold text-ink">Why this one: </span>
              {deal.whyThis}
            </p>
          ) : null}
          {deal.lastChecked ? (
            <p className="mt-2 text-xs text-ink-soft">
              Last checked {formatDate(deal.lastChecked)}
            </p>
          ) : null}
          {disclosureLine}
        </div>
      </div>
      <div className="shrink-0 sm:pt-8">
        {cta}
        {nearButtonDisclosure}
      </div>
    </article>
  );
}
