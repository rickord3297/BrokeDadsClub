"use client";

import Link from "next/link";
import { trackGuideClick } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import { getCategoryDisplay } from "@/lib/guide-display";
import type { GuideListItem } from "@/lib/guide-list";
import type { Guide } from "@/lib/guides";

type GuideCardGuide = Pick<
  Guide,
  "slug" | "title" | "excerpt" | "category" | "readTime" | "publishedAt"
> &
  Partial<Pick<GuideListItem, "takeaways" | "resourceSlug" | "resourceTitle" | "shopSlug" | "shopLabel">>;

function CategoryAnchor({
  category,
  size = "default",
}: {
  category: string;
  size?: "default" | "lg";
}) {
  const display = getCategoryDisplay(category);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl border border-rule/80 font-stamp font-bold uppercase tracking-wide text-ink-soft ${display.panel} ${
        size === "lg" ? "h-16 w-16 text-2xl sm:h-20 sm:w-20 sm:text-3xl" : "h-12 w-12 text-lg"
      }`}
      aria-hidden
    >
      {display.glyph}
    </div>
  );
}

function MetaRow({ guide }: { guide: GuideCardGuide }) {
  const display = getCategoryDisplay(guide.category);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={`rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.14em] ${display.badge}`}
      >
        {guide.category}
      </span>
      <span className="text-ink-soft">·</span>
      <span className={`font-medium ${display.badgeText}`}>{guide.readTime}</span>
    </div>
  );
}

function Takeaways({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 space-y-1.5 border-l-2 border-pine/25 pl-3">
      {items.map((item) => (
        <li key={item} className="text-sm leading-6 text-ink-soft">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ResourceTieIn({
  resourceSlug,
  resourceTitle,
  shopSlug,
  shopLabel,
}: {
  resourceSlug?: string;
  resourceTitle?: string;
  shopSlug?: string;
  shopLabel?: string;
}) {
  if (!resourceSlug && !shopSlug) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {resourceSlug && resourceTitle ? (
        <Link
          href={`/resources/${resourceSlug}`}
          onClick={(event) => event.stopPropagation()}
          className="rounded-full border border-pine/30 bg-pine/[0.06] px-3 py-1 text-xs font-semibold text-pine transition hover:border-pine hover:bg-pine/10"
        >
          Printable: {resourceTitle} →
        </Link>
      ) : null}
      {shopSlug && shopLabel ? (
        <Link
          href={`/shop/${shopSlug}`}
          onClick={(event) => event.stopPropagation()}
          className="rounded-full border border-rule bg-paper-2/80 px-3 py-1 text-xs font-medium text-ink-soft transition hover:border-rust hover:text-rust"
        >
          Shop: {shopLabel} →
        </Link>
      ) : null}
    </div>
  );
}

export function GuideCard({
  guide,
  badge,
  placement,
  variant = "default",
}: {
  guide: GuideCardGuide;
  badge?: string;
  placement?: string;
  variant?: "default" | "featured" | "hero" | "compact";
}) {
  const display = getCategoryDisplay(guide.category);
  const onTrack = () => {
    if (placement) trackGuideClick(guide.slug, placement);
  };

  if (variant === "hero") {
    return (
      <Link
        href={`/guides/${guide.slug}`}
        onClick={onTrack}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-pine/30 bg-paper shadow-lg shadow-pine/10 ring-1 ring-pine/10 transition hover:-translate-y-0.5 hover:border-pine hover:shadow-xl lg:flex-row"
      >
        <div
          className={`relative flex min-h-[8rem] items-end bg-gradient-to-br p-6 lg:min-h-0 lg:w-[min(36%,14rem)] lg:shrink-0 lg:flex-col lg:justify-between ${display.panel}`}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${display.stripe}`}
          />
          <CategoryAnchor category={guide.category} size="lg" />
          {badge ? (
            <p className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-pine">
              {badge}
            </p>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <MetaRow guide={guide} />
          <h2 className="mt-3 font-display text-3xl leading-tight transition group-hover:text-rust sm:text-4xl">
            {guide.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
            {guide.excerpt}
          </p>
          <Takeaways items={guide.takeaways} />
          <ResourceTieIn
            resourceSlug={guide.resourceSlug}
            resourceTitle={guide.resourceTitle}
            shopSlug={guide.shopSlug}
            shopLabel={guide.shopLabel}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5">
            <p className="text-xs text-ink-soft">{formatDate(guide.publishedAt)}</p>
            <span className="inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-paper transition group-hover:bg-pine-2">
              Read the guide →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/guides/${guide.slug}`}
        onClick={onTrack}
        className="group flex cursor-pointer gap-3 rounded-xl border border-rule bg-paper p-4 transition hover:border-pine hover:bg-pine/[0.03]"
      >
        <CategoryAnchor category={guide.category} />
        <div className="min-w-0 flex-1">
          <MetaRow guide={guide} />
          <h3 className="mt-2 font-display text-lg leading-snug group-hover:text-rust">
            {guide.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-soft">
            {guide.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/guides/${guide.slug}`}
        onClick={onTrack}
        className="group flex h-full min-h-[15rem] cursor-pointer flex-col border border-rule bg-paper p-5 transition hover:-translate-y-0.5 hover:border-pine hover:bg-pine/[0.03] hover:shadow-md hover:shadow-pine/10"
      >
        <MetaRow guide={guide} />
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
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
        <Takeaways items={guide.takeaways} />
        <span className="mt-4 border-t border-rule pt-3 text-sm font-medium text-pine transition group-hover:text-rust">
          Read guide →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/guides/${guide.slug}`}
      onClick={onTrack}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:border-pine hover:shadow-lg hover:shadow-pine/10"
    >
      <div
        className={`relative flex items-center gap-3 border-b border-rule bg-gradient-to-r px-5 py-4 ${display.stripe}`}
      >
        <CategoryAnchor category={guide.category} />
        <div className="min-w-0 flex-1">
          <MetaRow guide={guide} />
          {badge ? (
            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-pine">
              {badge}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-paper p-5">
        <h3 className="font-display text-2xl leading-tight group-hover:text-rust">
          {guide.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
        <Takeaways items={guide.takeaways} />
        <ResourceTieIn
          resourceSlug={guide.resourceSlug}
          resourceTitle={guide.resourceTitle}
          shopSlug={guide.shopSlug}
          shopLabel={guide.shopLabel}
        />
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-rule/80 pt-4">
          <p className="text-[11px] text-ink-soft">{formatDate(guide.publishedAt)}</p>
          <span className="inline-flex h-10 shrink-0 items-center rounded-full bg-pine px-4 text-sm font-semibold text-paper transition group-hover:bg-pine-2">
            Read the guide
          </span>
        </div>
      </div>
    </Link>
  );
}
