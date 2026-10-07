import {
  dealMerchantLabel,
  formatTargetPrice,
  type DealItem,
} from "@/lib/newsletter-model";

/** Google asks for "sponsored" on paid/affiliate links; "nofollow" covers crawlers that ignore it. */
export const DEAL_LINK_REL = "noopener noreferrer nofollow sponsored";

function MerchantBadge({ deal }: { deal: DealItem }) {
  return (
    <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
      {dealMerchantLabel(deal)}
    </span>
  );
}

/**
 * One curated deal. "row" is the full-width issue-page layout; "compact" stacks
 * inside the archive's latest-issue card.
 */
export function DealCard({
  deal,
  variant = "row",
}: {
  deal: DealItem;
  variant?: "row" | "compact";
}) {
  const merchant = dealMerchantLabel(deal);
  const srLabel = (
    <span className="sr-only">
      {" "}at {merchant} for {deal.title} (opens in a new tab)
    </span>
  );

  if (variant === "compact") {
    return (
      <article className="flex h-full flex-col rounded-xl border border-rule bg-paper p-4">
        <div className="flex items-start justify-between gap-3">
          <MerchantBadge deal={deal} />
          <p className="text-right text-xs leading-4 text-ink-soft">
            Target price
            <span className="block font-display text-xl leading-6 text-ink">
              {formatTargetPrice(deal.targetPrice)}
            </span>
          </p>
        </div>
        <h4 className="mt-2 font-semibold leading-snug text-ink">{deal.title}</h4>
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
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-rule bg-paper p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <MerchantBadge deal={deal} />
        <h3 className="mt-3 font-display text-xl leading-snug text-ink">{deal.title}</h3>
        <p className="mt-1 text-sm font-semibold text-pine">
          Target price: {formatTargetPrice(deal.targetPrice)}
        </p>
        {deal.note ? (
          <p className="mt-2 text-sm leading-6 text-ink-soft">{deal.note}</p>
        ) : null}
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
