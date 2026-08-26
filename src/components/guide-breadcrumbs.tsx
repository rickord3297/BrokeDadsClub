import Link from "next/link";

export function GuideBreadcrumbs({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-pine">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li>
          <Link href="/guides" className="hover:text-pine">
            Guides
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li>
          <Link
            href={`/guides?topic=${encodeURIComponent(category)}`}
            className="hover:text-pine"
          >
            {category}
          </Link>
        </li>
        <li aria-hidden className="text-rule">
          /
        </li>
        <li className="max-w-[14rem] truncate text-ink sm:max-w-md" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
