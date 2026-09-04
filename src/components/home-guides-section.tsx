import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { GuideListItem } from "@/lib/guide-model";

const LATEST_COUNT = 9;

export function HomeGuidesSection({ guides }: { guides: GuideListItem[] }) {
  const latest = guides.slice(0, LATEST_COUNT);

  return (
    <section
      id="start-here"
      className="scroll-mt-20 border-t border-pine/15 bg-pine/[0.04]"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl text-pine sm:text-[2rem]">
            The Guides
          </h2>
          <Link
            href="/guides"
            className="shrink-0 text-sm font-medium text-pine underline decoration-pine/30 underline-offset-4 transition hover:text-rust hover:decoration-rust/40"
          >
            All guides →
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                placement="homepage_grid"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
