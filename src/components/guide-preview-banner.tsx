import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { GuidePreviewState } from "@/lib/guides";

const LABELS: Record<GuidePreviewState, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  live: "Live (scheduled date passed)",
  published: "Published",
};

export function GuidePreviewBanner({
  previewState,
  publishedAt,
  liveHref,
}: {
  previewState: GuidePreviewState;
  publishedAt: string;
  liveHref?: string;
}) {
  const isPublic =
    previewState === "published" || previewState === "live";

  return (
    <div className="border-b border-rust/30 bg-rust/10 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
            Internal preview · {LABELS[previewState]}
          </p>
          {previewState === "scheduled" ? (
            <p className="mt-1 text-sm text-ink-soft">
              Goes live {formatDate(publishedAt)} (UTC). Hidden on the public
              site until then.
            </p>
          ) : previewState === "draft" ? (
            <p className="mt-1 text-sm text-ink-soft">
              Draft only. Not on the public site until status changes.
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">
              Matches the live article layout. Compare with the public URL
              below.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/preview/guides"
            className="font-medium text-pine hover:text-rust"
          >
            All previews
          </Link>
          {isPublic && liveHref ? (
            <>
              <span className="text-rule">·</span>
              <Link
                href={liveHref}
                className="font-medium text-pine hover:text-rust"
              >
                View live page
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
