"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareGuide } from "@/components/share-guide";

/** Compact share bar below site header once the reader scrolls past the title. */
export function GuideStickyBar({
  title,
  url,
  slug,
  listCta = false,
}: {
  title: string;
  url: string;
  slug: string;
  /** Jump to the early grocery-list signup when this guide shows one. */
  listCta?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector("[data-reading-progress]");
      if (!article) return;
      const headerBottom = article.getBoundingClientRect().top + 220;
      setVisible(headerBottom < 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-[57px] z-30 border-b border-rule bg-paper/95 shadow-sm backdrop-blur-sm print:hidden sm:top-[65px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <p className="min-w-0 truncate text-sm font-medium text-ink-soft">
          {title}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {listCta ? (
            <Link
              href="#get-list"
              className="hidden text-sm font-semibold text-pine transition hover:text-rust sm:inline"
            >
              Free grocery list
            </Link>
          ) : null}
          <ShareGuide title={title} url={url} slug={slug} />
        </div>
      </div>
    </div>
  );
}
