import { DealCard } from "@/components/deal-card";
import { dealDisclosures, type DealItem } from "@/lib/newsletter-model";

export function NewsletterDeals({
  deals,
  headingId,
  variant = "compact",
  heading,
  eyebrow = "Deals",
}: {
  deals: DealItem[];
  headingId: string;
  /** "compact" stacks inside archive cards; "callout" is the full issue-page block. */
  variant?: "compact" | "callout";
  heading?: string;
  eyebrow?: string;
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
            {eyebrow}
          </p>
          <h2 id={headingId} className="mt-1 font-display text-2xl leading-snug sm:text-3xl">
            {heading ?? "Dad Tax Offsets"}
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
        {deals.map((deal) => (
          <li key={deal.url}>
            <DealCard deal={deal} variant={isCallout ? "row" : "compact"} />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-5 text-ink-soft/80">
        {isCallout ? "" : "Target prices are what we would pay, not live prices. "}
        {dealDisclosures(deals).join(" ")}
      </p>
    </section>
  );
}
