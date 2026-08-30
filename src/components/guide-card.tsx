"use client";

import Link from "next/link";
import { trackGuideClick } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import { categoryAccent } from "@/lib/guide-catalog";
import type { GuideListItem } from "@/lib/guide-model";

export function GuideCard({
  guide,
  badge,
  placement,
  variant = "default",
}: {
  guide: GuideListItem;
  badge?: string;
  placement?: string;
  variant?: "default" | "hero";
}) {
  const accent = categoryAccent(guide.category);
  const takeaways = guide.takeaways?.slice(0, 2) ?? [];
  const tieIn = guide.resourceTieIn;
  const href = `/guides/${guide.slug}`;

  function track() {
    if (placement) trackGuideClick(guide.slug, placement);
  }

  if (variant === "hero") {
    return (
      <article className="relative overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:border-pine hover:shadow-lg hover:shadow-pine/10">
        <div
          className={`absolute inset-y-0 left-0 w-1.5 ${accent.bar}`}
          aria-hidden
        />
        <Link
          href={href}
          onClick={track}
          className="group flex cursor-pointer flex-col"
        >
          <div className="flex flex-1 flex-col p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {badge ? (
                <span className="rounded-full bg-pine px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-paper">
                  {badge}
                </span>
              ) : null}
              <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
                {guide.category}
              </span>
              <span className="text-xs font-medium text-ink-soft">
                {guide.readTime}
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl leading-tight group-hover:text-rust sm:text-4xl">
              {guide.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
              {guide.excerpt}
            </p>
            {takeaways.length > 0 ? (
              <ul className="mt-4 space-y-1.5 text-sm leading-6 text-ink">
                {takeaways.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-rule/80 pt-4">
              <p className="text-xs text-ink-soft/80">
                {formatDate(guide.publishedAt)}
              </p>
              <span className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition group-hover:bg-pine-2">
                Read the guide
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:border-pine hover:shadow-lg hover:shadow-pine/10">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`}
        aria-hidden
      />
      <Link
        href={href}
        onClick={track}
        className="flex flex-1 cursor-pointer flex-col"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-rule bg-paper-2/80 px-5 py-3 pl-6">
          <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
            {guide.category}
          </span>
          <span className="text-xs font-medium text-ink-soft">
            {guide.readTime}
          </span>
        </div>
        <div className="flex flex-1 flex-col bg-paper p-5 pl-6">
          {badge ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
              {badge}
            </p>
          ) : null}
          <h3
            className={`font-display text-2xl leading-tight group-hover:text-rust ${badge ? "mt-2" : ""}`}
          >
            {guide.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
          {takeaways.length > 0 ? (
            <ul className="mt-3 space-y-1 text-sm leading-5 text-ink">
              {takeaways.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pine" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-rule/80 pt-4">
            <p className="text-xs text-ink-soft/80">
              {formatDate(guide.publishedAt)}
            </p>
            <span className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition group-hover:bg-pine-2">
              Read the guide
            </span>
          </div>
        </div>
      </Link>
      {tieIn ? (
        <div className="border-t border-rule/80 bg-paper-2/50 px-5 py-3 pl-6">
          <Link
            href={tieIn.href}
            className="text-xs font-medium text-pine underline decoration-pine/30 underline-offset-2 transition hover:text-rust"
          >
            Printable: {tieIn.label}
          </Link>
        </div>
      ) : null}
    </article>
  );
}
