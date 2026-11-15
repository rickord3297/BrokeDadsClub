import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import { getFeaturedDeals } from "@/lib/deals";
import { dealDisclosures } from "@/lib/newsletter-model";

export function HomeDealsSection() {
  const deals = getFeaturedDeals(3);
  if (deals.length === 0) return null;

  return (
    <section id="deals" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-6xl px-4 section-pad-sm sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
              Deals
            </p>
            <h2 className="mt-1 font-display text-3xl sm:text-[2rem]">
              Dad tax offsets
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
              Buy at or under the target. Above it, wait. We only list things we
              would buy for our own house.
            </p>
          </div>
          <Link
            href="/deals"
            className="shrink-0 text-sm font-medium text-pine transition hover:text-rust"
          >
            All deals →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <li key={`home-${deal.title}-${deal.url}`}>
              <DealCard deal={deal} variant="compact" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-5 text-ink-soft/80">
          {dealDisclosures(deals).join(" ")}
        </p>
      </div>
    </section>
  );
}
