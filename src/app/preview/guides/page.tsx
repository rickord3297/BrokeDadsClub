import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getAllGuides, type GuideStatus } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guide preview desk",
  robots: { index: false, follow: false },
};

const STATUS_ORDER: GuideStatus[] = ["draft", "scheduled", "published"];

function statusLabel(status: GuideStatus): string {
  if (status === "published") return "live";
  return status;
}

export default function GuidePreviewIndexPage() {
  const guides = getAllGuides();
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    items: guides.filter((guide) => guide.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">
        Internal preview
      </p>
      <h1 className="mt-3 font-display text-4xl">All guides as they render</h1>
      <p className="mt-4 text-base leading-7 text-ink-soft">
        Not indexed. Open any row to see the full article layout (same template
        as the public site). Drafts and future-dated scheduled posts stay hidden
        from{" "}
        <Link href="/guides" className="font-medium text-pine hover:text-rust">
          /guides
        </Link>{" "}
        until they go live.
      </p>

      {grouped.map((group) => (
        <section key={group.status} className="mt-12">
          <h2 className="font-display text-2xl capitalize">
            {statusLabel(group.status)} ({group.items.length})
          </h2>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {group.items.map((guide) => (
              <li key={guide.slug} className="py-4">
                <Link
                  href={`/preview/guides/${guide.slug}`}
                  className="group block"
                >
                  <p className="font-display text-xl group-hover:text-rust">
                    {guide.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {guide.category} · {guide.readTime} ·{" "}
                    {formatDate(guide.publishedAt)} ·{" "}
                    <span className="font-medium text-ink">
                      {statusLabel(guide.status)}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {guide.excerpt}
                  </p>
                </Link>
                {guide.status === "published" ? (
                  <p className="mt-2 text-xs text-ink-soft">
                    Public:{" "}
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="text-pine hover:text-rust"
                    >
                      /guides/{guide.slug}
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
