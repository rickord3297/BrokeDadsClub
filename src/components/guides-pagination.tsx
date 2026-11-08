import Link from "next/link";
import { guidesPageHref } from "@/lib/guide-pagination";

/** Server-rendered crawlable pagination. Real <a> tags, no buttons. */
export function GuidesPagination({
  basePath,
  page,
  totalPages,
  query = "",
}: {
  basePath: string;
  page: number;
  totalPages: number;
  query?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 pt-2"
      aria-label="Guide pages"
    >
      {page > 1 ? (
        <Link
          href={guidesPageHref(basePath, page - 1, query)}
          className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
          rel={page === 2 ? undefined : "prev"}
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink opacity-40">
          Previous
        </span>
      )}

      {pages.map((pageNumber) => {
        const current = pageNumber === page;
        return (
          <Link
            key={pageNumber}
            href={guidesPageHref(basePath, pageNumber, query)}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "flex h-9 min-w-9 items-center justify-center rounded-full bg-ink px-3 text-sm font-semibold text-paper"
                : "flex h-9 min-w-9 items-center justify-center rounded-full border border-rule px-3 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
            }
          >
            {pageNumber}
          </Link>
        );
      })}

      {page < totalPages ? (
        <Link
          href={guidesPageHref(basePath, page + 1, query)}
          className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink opacity-40">
          Next
        </span>
      )}
    </nav>
  );
}
