import {
  dealMerchantLabel,
  formatTargetPrice,
  type DealItem,
} from "@/lib/newsletter-model";

export function NewsletterDeals({
  deals,
  headingId,
  variant = "compact",
  heading,
}: {
  deals: DealItem[];
  headingId: string;
  heading?: string;
  /** "compact" stacks inside archive cards; "callout" is the full issue-page block. */
  variant?: "compact" | "callout";
}) {
  if (deals.length === 0) return null;
  const isCallout = variant === "callout";

  return (
    <section
      aria-labelledby={headingId}
      className={
        isCallout
          ? "rounded-2xl border border-rule border-l-[3px] border-l-rust bg-paper-2/70 p-5 sm:p-7"
          : undefined
      }
    >
      {isCallout ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Deals
          </p>
          <h2 id={headingId} className="mt-1 font-display text-2xl leading-snug sm:text-3xl">
            {heading ?? "This Week's Dad Tax Offsets"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            Buy at or under the target price. Above it, wait.
          </p>
        </>
      ) : (
        <h3
          id={headingId}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft"
        >
          {heading ?? `${deals.length === 3 ? "3 vetted deals" : "Vetted deals"} this week`}
        </h3>
      )}
      <ul className={`grid gap-3 ${isCallout ? "mt-5" : "mt-3"}`}>
        {deals.map((deal) =>
          isCallout ? (
            <li
              key={deal.url}
              className="flex flex-col gap-4 rounded-xl border border-rule bg-paper p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
                  {dealMerchantLabel(deal)}
                </span>
                <h3 className="mt-3 font-semibold leading-snug text-ink">{deal.title}</h3>
                {deal.note ? (
                  <p className="mt-1.5 text-sm leading-6 text-ink-soft">{deal.note}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-rule/80 pt-3 sm:w-40 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
                <p className="text-xs leading-4 text-ink-soft">
                  Target price
                  <span className="block font-display text-2xl leading-8 text-ink">
                    {formatTargetPrice(deal.targetPrice)}
                  </span>
                </p>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2"
                >
                  Check price
                  <span className="sr-only">
                    {" "}at {dealMerchantLabel(deal)} for {deal.title} (opens in a new tab)
                  </span>
                  <span aria-hidden className="ml-1">→</span>
                </a>
              </div>
            </li>
          ) : (
          <li
            key={deal.url}
            className="flex flex-col rounded-xl border border-rule bg-paper p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
                {dealMerchantLabel(deal)}
              </span>
              <p className="text-right text-xs leading-4 text-ink-soft">
                Target price
                <span className="block font-display text-xl leading-6 text-ink">
                  {formatTargetPrice(deal.targetPrice)}
                </span>
              </p>
            </div>
            <p className="mt-2 font-semibold leading-snug text-ink">{deal.title}</p>
            {deal.note ? (
              <p className="mt-1.5 flex-1 text-sm leading-6 text-ink-soft">{deal.note}</p>
            ) : null}
            <a
              href={deal.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-3 text-sm font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
            >
              Check price at {dealMerchantLabel(deal)}
              <span className="sr-only"> for {deal.title} (opens in a new tab)</span> →
            </a>
          </li>
          ),
        )}
      </ul>
      <p className="mt-4 text-xs leading-5 text-ink-soft/80">
        {isCallout ? "" : "Target prices are what we would pay, not live prices. "}
        Some links may earn us a small commission at no cost to you.
      </p>
    </section>
  );
}
