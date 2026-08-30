"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuideHeading } from "@/lib/guide-model";

type TocItem = { id: string; text: string };

function TocList({
  items,
  activeId,
  onNavigate,
}: {
  items: TocItem[];
  activeId?: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-2">
      {items.map((heading) => {
        const active = activeId === heading.id;
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={onNavigate}
              className={
                active
                  ? "border-l-2 border-rust pl-2 text-sm font-semibold text-rust"
                  : "border-l-2 border-transparent pl-2 text-sm font-medium text-pine hover:text-rust"
              }
              aria-current={active ? "location" : undefined}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export function GuideTableOfContents({
  headings,
  includeFaq = false,
  includeKeepGoing = false,
  variant = "mobile",
}: {
  headings: GuideHeading[];
  includeFaq?: boolean;
  includeKeepGoing?: boolean;
  variant?: "mobile" | "desktop";
}) {
  const items = useMemo(() => {
    const extra: TocItem[] = [];
    if (includeFaq) extra.push({ id: "quick-answers", text: "Quick answers" });
    if (includeKeepGoing) extra.push({ id: "keep-going", text: "Keep going" });
    return [...headings, ...extra];
  }, [headings, includeFaq, includeKeepGoing]);

  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useActiveHeading(ids);

  if (headings.length < 2) return null;

  if (variant === "desktop") {
    return (
      <nav aria-label="On this page" className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-rule bg-paper-2/90 px-4 py-4 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rust">
            On this page
          </p>
          <div className="mt-3">
            <TocList items={items} activeId={activeId} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <details className="guide-toc-mobile group mt-6 rounded-xl border border-rule bg-paper-2/70 open:border-pine/25 open:bg-paper-2 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-rust">
          Jump to a section
        </span>
        <span
          aria-hidden
          className="shrink-0 text-pine transition group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-rule/80 px-4 pb-4 pt-3">
        {activeId ? (
          <p className="mb-3 text-xs font-medium text-ink-soft">
            Reading: {items.find((item) => item.id === activeId)?.text}
          </p>
        ) : null}
        <TocList
          items={items}
          activeId={activeId}
          onNavigate={() => {
            const details = document.querySelector(
              "details.guide-toc-mobile",
            ) as HTMLDetailsElement | null;
            if (details) details.open = false;
          }}
        />
      </div>
    </details>
  );
}
