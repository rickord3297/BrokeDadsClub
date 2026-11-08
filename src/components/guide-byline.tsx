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
      <p className="text-sm text-ink">
        By{" "}
        <Link
          href={siteAuthor.path}
          className="font-medium text-ink hover:text-pine"
        >
          {siteAuthor.name}
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
