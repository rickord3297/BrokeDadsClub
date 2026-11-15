import { AFFILIATE_CONFIG, type ApprovedMerchant } from "@/lib/affiliate";
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

/**
 * One curated deal. "row" is the full-width issue-page layout; "compact" stacks
 * inside the archive's latest-issue card. Lists show the merchant disclosure
 * once below the cards; pass `showDisclosure` when a card stands alone.
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
  const disclosureLine = showDisclosure ? (
    <p className="mt-3 text-xs leading-5 text-ink-soft/80">{disclosure}</p>
  ) : null;
  const srLabel = (
    <span className="sr-only">
      {" "}at {merchant} for {deal.title} (opens in a new tab)
    </span>
  );

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
        <h4 className="mt-2 font-semibold leading-snug text-ink">{deal.title}</h4>
        <DiscountBadge deal={deal} />
        {deal.note ? (
          <p className="mt-1.5 flex-1 text-sm leading-6 text-ink-soft">{deal.note}</p>
        ) : null}
        <a
          href={deal.url}
          target="_blank"
          rel={DEAL_LINK_REL}
          className="mt-3 text-sm font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
        >
          Check price{srLabel} <span aria-hidden>→</span>
        </a>
        {disclosureLine}
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-rule bg-paper p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <MerchantBadge merchant={deal.merchant} />
        <h3 className="mt-3 font-display text-xl leading-snug text-ink">{deal.title}</h3>
        <DiscountBadge deal={deal} />
        <p className="mt-1 text-sm font-semibold text-pine">
          {onSale
            ? `Now: ${formatTargetPrice(deal.price ?? deal.targetPrice)}`
            : `Target price: ${formatTargetPrice(deal.targetPrice)}`}
        </p>
        {deal.note ? (
          <p className="mt-2 text-sm leading-6 text-ink-soft">{deal.note}</p>
        ) : null}
        {disclosureLine}
      </div>
      <div className="shrink-0 sm:pt-8">
        <a
          href={deal.url}
          target="_blank"
          rel={DEAL_LINK_REL}
          className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2"
        >
          Check price{srLabel}
          <span aria-hidden className="ml-1">→</span>
        </a>
      </div>
    </article>
  );
}
