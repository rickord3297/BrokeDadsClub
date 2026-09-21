import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import {
  getAllGuides,
  getGuideCategories,
  guidePreviewState,
  type GuidePreviewState,
} from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guide preview index",
  robots: { index: false, follow: false },
};

const STATUS_ORDER: GuidePreviewState[] = [
  "draft",
  "scheduled",
  "live",
  "published",
];

const STATUS_LABELS: Record<GuidePreviewState, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  live: "Live",
  published: "Published",
};

function statusBadgeClass(state: GuidePreviewState): string {
  switch (state) {
    case "draft":
      return "bg-rust/15 text-rust-2";
    case "scheduled":
      return "bg-amber-100 text-amber-900";
    case "live":
      return "bg-pine/15 text-pine";
    case "published":
      return "bg-ink/10 text-ink-soft";
  }
}

export default async function GuidePreviewIndexPage({
  searchParams,
}: PageProps<"/preview/guides">) {
  const params = await searchParams;
  const topicFilter =
    typeof params.topic === "string" ? params.topic.trim() : "";
  const statusFilter =
    typeof params.status === "string"
      ? (params.status.trim() as GuidePreviewState)
      : "";

  const allGuides = getAllGuides();
  const categories = getGuideCategories(allGuides);

  const rows = allGuides
    .map((guide) => ({
      guide,
      previewState: guidePreviewState(guide),
    }))
    .filter(({ guide, previewState }) => {
      if (topicFilter && guide.category !== topicFilter) return false;
      if (statusFilter && previewState !== statusFilter) return false;
      return true;
    });

  const counts = allGuides.reduce(
    (acc, guide) => {
      const state = guidePreviewState(guide);
      acc[state] += 1;
      acc.all += 1;
      return acc;
    },
    { all: 0, draft: 0, scheduled: 0, live: 0, published: 0 },
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">
        Internal preview
      </p>
      <h1 className="mt-3 font-display text-4xl">All guides</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
        Preview every guide file on disk, including drafts and future scheduled
        posts. These URLs are not in the nav and should not be indexed. Public
        visitors only see live guides at{" "}
        <Link href="/guides" className="text-pine hover:text-rust">
          /guides
        </Link>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        <Link
          href="/preview/guides"
          className={`rounded-full px-3 py-1.5 font-medium transition ${
            !statusFilter
              ? "bg-pine text-paper"
              : "border border-rule bg-paper text-ink-soft hover:border-pine"
          }`}
        >
          All ({counts.all})
        </Link>
        {STATUS_ORDER.map((state) => (
          <Link
            key={state}
            href={`/preview/guides?status=${state}${topicFilter ? `&topic=${encodeURIComponent(topicFilter)}` : ""}`}
            className={`rounded-full px-3 py-1.5 font-medium transition ${
              statusFilter === state
                ? "bg-pine text-paper"
                : "border border-rule bg-paper text-ink-soft hover:border-pine"
            }`}
          >
            {STATUS_LABELS[state]} ({counts[state]})
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href={
            statusFilter
              ? `/preview/guides?status=${statusFilter}`
              : "/preview/guides"
          }
          className={`rounded-full px-3 py-1.5 font-medium transition ${
            !topicFilter
              ? "bg-rust/15 text-rust-2"
              : "border border-rule bg-paper text-ink-soft hover:border-rust"
          }`}
        >
          All topics
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/preview/guides?topic=${encodeURIComponent(category)}${statusFilter ? `&status=${statusFilter}` : ""}`}
            className={`rounded-full px-3 py-1.5 font-medium transition ${
              topicFilter === category
                ? "bg-rust/15 text-rust-2"
                : "border border-rule bg-paper text-ink-soft hover:border-rust"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-rule bg-paper shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-rule bg-paper-2/80 text-xs uppercase tracking-[0.12em] text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Go live</th>
              <th className="px-4 py-3 font-semibold">Preview</th>
              <th className="px-4 py-3 font-semibold">Public</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {rows.map(({ guide, previewState }) => {
              const isPublic =
                previewState === "published" || previewState === "live";
              return (
                <tr key={guide.slug} className="hover:bg-paper-2/40">
                  <td className="px-4 py-3 font-medium text-ink">
                    {guide.title}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{guide.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${statusBadgeClass(previewState)}`}
                    >
                      {STATUS_LABELS[previewState]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {formatDate(guide.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/preview/guides/${guide.slug}`}
                      className="font-medium text-pine hover:text-rust"
                    >
                      Open preview
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {isPublic ? (
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="font-medium text-pine hover:text-rust"
                      >
                        Live page
                      </Link>
                    ) : (
                      <span className="text-ink-soft/60">Hidden</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">
          No guides match these filters.
        </p>
      ) : null}

      <p className="mt-10 text-sm text-ink-soft">
        <Link href="/preview/sunday-email" className="text-pine hover:text-rust">
          Sunday email preview
        </Link>
        <span className="mx-2 text-rule">·</span>
        <Link href="/guides" className="text-pine hover:text-rust">
          Public guides index
        </Link>
      </p>
    </div>
  );
}
