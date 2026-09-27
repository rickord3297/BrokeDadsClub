"use client";

import Link from "next/link";
import type { GuidePreviewState } from "@/lib/guides";

const LABELS: Record<GuidePreviewState, string> = {
  draft: "Draft — not on the public site",
  scheduled: "Scheduled — not live yet",
  live: "Live via schedule date (status still scheduled)",
  published: "Published",
};

/** Banner for internal guide preview pages. */
export function GuidePreviewBanner({
  state,
  goLive,
  publicHref,
}: {
  state: GuidePreviewState;
  goLive: string;
  publicHref?: string | null;
}) {
  return (
    <div className="border-b border-rule bg-paper-2 px-4 py-3 text-sm print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft">
          <span className="font-semibold text-rust">Internal preview</span>
          <span className="mx-2 text-rule">·</span>
          {LABELS[state]}
          <span className="mx-2 text-rule">·</span>
          Go live {goLive}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/preview/guides" className="font-medium text-pine hover:text-rust">
            ← All drafts
          </Link>
          {publicHref ? (
            <Link href={publicHref} className="font-medium text-pine hover:text-rust">
              Public page
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
