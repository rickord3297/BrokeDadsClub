import Link from "next/link";
import type { GuideListItem } from "@/lib/guide-model";

/**
 * Server-rendered guide links for crawlers.
 * Visually hidden; the card grid is the visible UI.
 */
export function GuidesCrawlIndex({ guides }: { guides: GuideListItem[] }) {
  return (
    <nav aria-label="All guides" className="sr-only">
      <ul>
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guides/${guide.slug}`}>
              {guide.title}. {guide.excerpt}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
