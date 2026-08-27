"use client";

import Link from "next/link";
import { trackGuideClick } from "@/lib/analytics";
import { relatedGuideHook } from "@/lib/guide-catalog";
import type { GuideListItem } from "@/lib/guide-model";

/** Responsive next-step hub: stacked cards on mobile, row list on larger screens. */
export function GuideKeepGoing({ guides }: { guides: GuideListItem[] }) {
  if (!guides.length) return null;

  const picks = guides.slice(0, 4);

  return (
    <section className="mt-12 border-t border-rule pt-8" id="keep-going">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Keep going</p>
      <h2 className="mt-2 font-display text-3xl">What to read next</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
        Pick the next problem, not another tab.
      </p>

      <ul className="mt-6 grid gap-3 sm:gap-0 sm:divide-y sm:overflow-hidden sm:rounded-2xl sm:border sm:border-rule sm:bg-paper">
        {picks.map((guide) => {
          const hook = relatedGuideHook(guide.slug, guide.category);
          return (
            <li
              key={guide.slug}
              className="rounded-xl border border-rule bg-paper sm:rounded-none sm:border-0"
            >
              <Link
                href={`/guides/${guide.slug}`}
                onClick={() => trackGuideClick(guide.slug, "keep_going")}
                className="group flex flex-col gap-1.5 px-4 py-3.5 transition hover:bg-paper-2/70 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-5 sm:py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-snug text-ink sm:text-xs sm:font-semibold sm:uppercase sm:tracking-[0.12em] sm:text-pine">
                    {hook}
                  </p>
                  <p className="mt-1 font-display text-lg leading-snug text-pine group-hover:text-rust sm:text-xl sm:text-ink">
                    {guide.title}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-ink-soft group-hover:text-pine">
                  {guide.readTime} →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
