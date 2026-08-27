import Link from "next/link";

export function GuideBreadcrumbs({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="rounded-lg border border-rule/80 bg-paper-2/50 px-3 py-2.5 text-sm text-ink-soft"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="font-medium hover:text-pine">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li>
          <Link href="/guides" className="font-medium hover:text-pine">
            Guides
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li>
          <Link
            href={`/guides?topic=${encodeURIComponent(category)}`}
            className="font-medium text-pine hover:text-rust"
          >
            {category}
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li
          className="max-w-[12rem] truncate font-medium text-ink sm:max-w-md"
          aria-current="page"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}
