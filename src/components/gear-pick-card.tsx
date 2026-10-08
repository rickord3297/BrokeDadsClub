import { DEAL_LINK_REL } from "@/components/deal-card";
import { AFFILIATE_CONFIG } from "@/lib/affiliate";
import type { GearPick, GearPickVerdict } from "@/lib/gear-pick";
import { formatTargetPrice } from "@/lib/newsletter-model";

const VERDICT_META: Record<GearPickVerdict, { label: string; className: string }> = {
  essential: { label: "Essential", className: "bg-pine text-paper" },
  wait: { label: "Buy later", className: "bg-gold/25 text-ink" },
  skip: { label: "Skip it", className: "bg-ink/10 text-ink" },
};

/**
 * Product recommendation for guides, styled like the newsletter deal rows.
 * Uses div/span so `.prose-guide` heading and paragraph styles don't leak in.
 */
export function GearPickCard({ pick }: { pick: GearPick }) {
  const verdict = VERDICT_META[pick.verdict];
  const merchant = pick.link ? AFFILIATE_CONFIG[pick.link.merchant] : null;

  return (
    <aside
      aria-label={`Gear pick: ${pick.title}`}
      className="my-6 flex flex-col gap-4 rounded-xl border border-rule bg-paper p-4 shadow-sm shadow-ink/5 sm:flex-row sm:items-start sm:justify-between sm:p-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${verdict.className}`}>
            {pick.label || verdict.label}
          </span>
          {merchant ? (
            <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
              {merchant.name}
            </span>
          ) : null}
        </div>
        <div className="mt-3 font-display text-xl leading-snug text-ink">{pick.title}</div>
        <div className="mt-1 text-sm font-semibold text-pine">
          Target price: {formatTargetPrice(pick.targetPrice)}
        </div>
        {pick.tip ? (
          <div className="mt-2 text-sm leading-6 text-ink-soft">
            <span className="font-semibold text-ink">Quick tip: </span>
            {pick.tip}
          </div>
        ) : null}
        {merchant ? (
          <div className="mt-3 text-xs leading-5 text-ink-soft/80">{merchant.disclosure}</div>
        ) : null}
      </div>
      {pick.link && merchant ? (
        <div className="shrink-0 sm:pt-8">
          <a
            href={pick.link.url}
            target="_blank"
            rel={DEAL_LINK_REL}
            className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper no-underline transition hover:bg-pine-2"
          >
            Check price
            <span className="sr-only">
              {" "}at {merchant.name} for {pick.title} (opens in a new tab)
            </span>
            <span aria-hidden className="ml-1">→</span>
          </a>
        </div>
      ) : null}
    </aside>
  );
}
