import Link from "next/link";
import { siteAuthor } from "@/lib/author";

/** Short author bio for the bottom of each guide. */
export function GuideAuthorBio() {
  return (
    <aside
      className="mt-10 rounded-2xl border border-rule bg-paper-2/60 px-5 py-5 sm:px-6"
      aria-label="About the author"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rust">
        About the author
      </p>
      <p className="mt-2 text-sm font-medium text-ink">
        <Link href={siteAuthor.path} className="hover:text-pine">
          {siteAuthor.name}
        </Link>
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{siteAuthor.shortBio}</p>
      <p className="mt-3 text-sm">
        <Link
          href={siteAuthor.path}
          className="font-medium text-pine hover:text-rust"
        >
          More about Cord
        </Link>
      </p>
    </aside>
  );
}
