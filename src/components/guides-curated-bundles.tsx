import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { GuideBundle } from "@/lib/guide-bundles";
import type { GuideListItem } from "@/lib/guide-list";
import { guidesForSlugs } from "@/lib/guide-list";

export function GuidesCuratedBundles({
  bundles,
  allGuides,
}: {
  bundles: GuideBundle[];
  allGuides: GuideListItem[];
}) {
  return (
    <div className="mt-12 space-y-10">
      {bundles.map((bundle) => {
        const picks = guidesForSlugs(allGuides, bundle.slugs);
        if (picks.length === 0) return null;

        return (
          <section key={bundle.id} id={`bundle-${bundle.id}`} aria-labelledby={`bundle-${bundle.id}-title`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
                  Curated path
                </p>
                <h2
                  id={`bundle-${bundle.id}-title`}
                  className="mt-1 font-display text-2xl leading-tight sm:text-3xl"
                >
                  {bundle.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                  {bundle.description}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  placement={`guides_bundle_${bundle.id}`}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function GuidesBundleJumpLinks({
  bundles,
}: {
  bundles: GuideBundle[];
}) {
  return (
    <nav
      className="mt-8 flex flex-wrap gap-2"
      aria-label="Curated guide paths"
    >
      {bundles.map((bundle) => (
        <a
          key={bundle.id}
          href={`#bundle-${bundle.id}`}
          className="rounded-full border border-rule bg-paper px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-pine hover:text-pine"
        >
          {bundle.title}
        </a>
      ))}
      <Link
        href="/resources"
        className="rounded-full border border-rule bg-paper px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-pine hover:text-pine"
      >
        Free printables
      </Link>
    </nav>
  );
}
