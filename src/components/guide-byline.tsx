import Link from "next/link";
import { siteAuthor } from "@/lib/author";
import { formatDate } from "@/lib/format";

export function GuideByline({
  priceYear,
  priceRefreshBy,
}: {
  publishedAt?: string;
  updatedAt?: string;
  priceYear?: number;
  priceRefreshBy?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium text-ink">
        <Link
          href={siteAuthor.path}
          className="font-medium text-ink hover:text-pine"
        >
          {siteAuthor.name}
        </Link>
      </p>
      <p className="mt-1 max-w-md text-sm leading-6 text-ink-soft">
        {siteAuthor.line}{" "}
        <Link
          href={siteAuthor.path}
          className="font-medium text-pine hover:text-rust"
        >
          About the author
        </Link>
      </p>
      {priceYear ? (
        <p className="mt-2 text-sm text-ink-soft">
          <span>{priceYear} prices</span>
          {priceRefreshBy ? (
            <>
              <span className="mx-2 text-rule">·</span>
              <span>Refresh by {formatDate(priceRefreshBy)}</span>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
