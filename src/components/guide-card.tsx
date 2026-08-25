"use client";

import Link from "next/link";
import { trackGuideClick } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import type { Guide } from "@/lib/guides";
import type { HomeGuide } from "@/components/home-guides-section";

type GuideCardGuide = Pick<
  Guide,
  "slug" | "title" | "excerpt" | "category" | "readTime" | "publishedAt"
> | HomeGuide;

export function GuideCard({
  guide,
  badge,
  placement,
  variant = "default",
}: {
  guide: GuideCardGuide;
  badge?: string;
  placement?: string;
  variant?: "default" | "featured";
}) {
  const featured = variant === "featured";

  return (
    <Link
      href={`/guides/${guide.slug}`}
      onClick={() => {
        if (placement) trackGuideClick(guide.slug, placement);
      }}
      className={
        featured
          ? "group flex h-full min-h-[15rem] flex-col border border-rule bg-paper p-5 transition hover:border-pine hover:bg-pine/[0.03]"
          : "group flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5 transition hover:border-pine hover:shadow-lg hover:shadow-pine/10"
      }
    >
      {featured ? (
        <>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-rust">{guide.category}</span>
            <span className="text-ink-soft">{guide.readTime}</span>
          </div>
          {badge ? (
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-pine">
              {badge}
            </p>
          ) : null}
          <h3
            className={`font-display text-xl leading-snug transition group-hover:text-rust sm:text-2xl ${badge ? "mt-1.5" : "mt-2"}`}
          >
            {guide.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">
            {guide.excerpt}
          </p>
          <p className="mt-4 border-t border-rule pt-3 text-sm font-medium text-pine transition group-hover:text-rust">
            Read guide →
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-paper-2/80 px-5 py-3">
            <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
              {guide.category}
            </span>
            <span className="rounded-full bg-pine/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-pine">
              {guide.readTime}
            </span>
          </div>
          <div className="flex flex-1 flex-col bg-paper p-5">
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
            <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">
              {guide.excerpt}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-rule/80 pt-4">
              <p className="text-xs text-ink-soft">{formatDate(guide.publishedAt)}</p>
              <span className="inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper group-hover:bg-pine-2">
                Read the guide
              </span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}
