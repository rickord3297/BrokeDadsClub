import Link from "next/link";
import type { GuideListItem } from "@/lib/guide-model";
import { guideCategoryPath } from "@/lib/guide-pillars";

const CRAWL_FIRST = 30;

/**
 * Server-rendered guide index links for crawlers.
 * Always present in the HTML response (no JS required).
 */
export function GuidesCrawlIndex({ guides }: { guides: GuideListItem[] }) {
  const first = guides.slice(0, CRAWL_FIRST);
  const rest = guides.slice(CRAWL_FIRST);

  return (
    <nav
      aria-label="All guides"
      className="mt-10 rounded-2xl border border-rule bg-paper-2/40 px-5 py-6 sm:px-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
        All guides
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        {guides.length} guides. Titles and excerpts below so every link is in
        the page HTML.
      </p>
      <ul className="mt-5 space-y-4">
        {first.map((guide) => (
          <li key={guide.slug} className="border-b border-rule/70 pb-4 last:border-0 last:pb-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
              <Link
                href={guideCategoryPath(guide.category)}
                className="hover:text-rust"
              >
                {guide.category}
              </Link>
              <span className="mx-2 text-ink-soft/50">·</span>
              <span className="font-medium normal-case tracking-normal text-ink-soft">
                {guide.readTime}
              </span>
            </p>
            <Link
              href={`/guides/${guide.slug}`}
              className="mt-1 block font-display text-xl leading-snug text-ink hover:text-rust"
            >
              {guide.title}
            </Link>
            <p className="mt-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
          </li>
        ))}
      </ul>
      {rest.length > 0 ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-pine hover:text-rust">
            Show {rest.length} more guides
          </summary>
          <ul className="mt-4 space-y-4">
            {rest.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="font-medium text-ink hover:text-rust"
                >
                  {guide.title}
                </Link>
                <span className="text-ink-soft"> · {guide.category}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </nav>
  );
}
