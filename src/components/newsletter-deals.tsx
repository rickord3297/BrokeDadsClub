import { formatTargetPrice, type NewsletterDeal } from "@/lib/newsletter-model";

export function NewsletterDeals({
  deals,
  headingId,
  compact = false,
}: {
  deals: NewsletterDeal[];
  headingId: string;
  compact?: boolean;
}) {
  if (deals.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft"
      >
        {deals.length === 3 ? "3 vetted deals" : "Vetted deals"} this week
      </h3>
      <ul className={`mt-3 grid gap-3 ${compact ? "" : "sm:grid-cols-3"}`}>
        {deals.map((deal) => (
          <li
            key={`${deal.merchant}-${deal.title}`}
            className="flex flex-col rounded-xl border border-rule bg-paper p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
                {deal.merchant}
              </span>
              <p className="text-right text-xs leading-4 text-ink-soft">
                Buy under
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
              href={deal.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-3 text-sm font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
            >
              Check price at {deal.merchant}
              <span className="sr-only"> for {deal.title} (opens in a new tab)</span> →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-5 text-ink-soft/80">
        Target prices are what we would pay, not live prices. Some links may earn us a
        small commission at no cost to you.
      </p>
    </section>
  );
}
