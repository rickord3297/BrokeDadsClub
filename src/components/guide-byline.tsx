import Link from "next/link";
import { formatDate } from "@/lib/format";
import { authorBio } from "@/lib/guide-pillars";

export function GuideByline({
  publishedAt,
  updatedAt,
}: {
  publishedAt: string;
  updatedAt: string;
}) {
  const bio = authorBio();
  const showUpdated = updatedAt !== publishedAt;

  return (
    <div className="min-w-0">
      <p className="text-sm font-medium text-ink">{bio.name}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-ink-soft">
        {bio.line}{" "}
        <Link href={bio.aboutHref} className="font-medium text-pine hover:text-rust">
          About
        </Link>
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        <span>Published {formatDate(publishedAt)}</span>
        {showUpdated ? (
          <>
            <span className="mx-2 text-rule">·</span>
            <span>Updated {formatDate(updatedAt)}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
