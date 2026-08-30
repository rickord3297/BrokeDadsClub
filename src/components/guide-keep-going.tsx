"use client";

import Link from "next/link";
import { trackGuideClick } from "@/lib/analytics";
import { relatedGuideHook } from "@/lib/guide-catalog";
import type { GuideListItem } from "@/lib/guide-model";

/** Four-card "what to read next" grid with intent hooks. */
export function GuideKeepGoing({ guides }: { guides: GuideListItem[] }) {
  if (!guides.length) return null;

  const picks = guides.slice(0, 4);

  return (
    <section className="mt-12 border-t border-rule pt-8" id="keep-going">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
        What to read next
      </p>
      <h2 className="mt-2 font-display text-3xl">Pick the next problem</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
        Not another tab. One guide that matches what broke this week.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {picks.map((guide) => {
          const hook = relatedGuideHook(guide.slug, guide.category);
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              onClick={() => trackGuideClick(guide.slug, "keep_going")}
              className="group flex min-h-[11rem] flex-col rounded-2xl border border-rule bg-paper p-5 shadow-sm shadow-ink/5 ring-1 ring-ink/5 transition hover:border-pine hover:shadow-md hover:shadow-pine/10"
            >
              <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-pine">
                {hook}
              </p>
              <h3 className="mt-3 flex-1 font-display text-xl leading-snug text-ink group-hover:text-rust">
                {guide.title}
              </h3>
              <p className="mt-4 text-sm font-medium text-ink-soft group-hover:text-pine">
                {guide.readTime} · Read the guide
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
