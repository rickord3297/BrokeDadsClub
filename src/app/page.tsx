import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { ProductCard } from "@/components/product-card";
import { ResourceCard } from "@/components/resource-card";
import { StartHereLink } from "@/components/start-here-link";
import { TopicPills } from "@/components/topic-pills";
import {
  START_HERE_SLUGS,
  getGuide,
  getGuideCategories,
  getGuides,
} from "@/lib/guides";
import { getHomeShopProducts } from "@/lib/products";
import { getResource } from "@/lib/resources";
import { site } from "@/lib/site";

const FEATURED_PRINTABLE = "grocery-week-checklist";

export default async function Home() {
  const guides = getGuides();
  const categories = getGuideCategories(guides);
  const startHere = START_HERE_SLUGS.map((slug) => getGuide(slug)).filter(
    (guide): guide is NonNullable<typeof guide> => guide != null,
  );
  const featuredPrintable = getResource(FEATURED_PRINTABLE);
  const shopPicks = await getHomeShopProducts();

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 section-pad sm:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">
              Guides for stretched-thin dads
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Raising kids.
              <br />
              Stretching dollars.
              <br />
              Still showing up.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              Practical guides for dads doing the math out loud. {site.tagline}
            </p>
            <StartHereLink
              href="#start-here"
              className="mt-8 inline-flex h-12 items-center rounded-md bg-ink px-6 text-sm font-medium text-paper transition hover:bg-pine"
            >
              Show me where to start
            </StartHereLink>
          </div>
        </div>
      </section>

      <section id="start-here" className="scroll-mt-20 border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 section-pad sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Start here</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Four guides that pay rent. Everything else lives on the guides
                page.
              </p>
            </div>
            <Link
              href="/guides"
              className="shrink-0 text-sm font-medium text-ink-soft transition hover:text-pine"
            >
              All guides →
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-10">
              <TopicPills categories={categories} size="lg" variant="tabs" />
            </div>
          ) : null}

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {startHere.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                placement="start_here"
                variant="featured"
                badge={
                  guide.slug === "the-dad-tax" ? "Most popular" : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      <InlineEmailBar
        source="homepage-inline"
        successHref="/resources/grocery-week-checklist"
        successLinkLabel="Print the grocery checklist"
      />

      {featuredPrintable ? (
        <section id="printables" className="scroll-mt-20 border-t border-rule">
          <div className="mx-auto max-w-6xl px-4 section-pad sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                  Printables
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                  One sheet for the fridge
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                  Start with the grocery-week checklist. More sheets on the
                  printables page.
                </p>
              </div>
              <Link
                href="/resources"
                className="shrink-0 text-sm font-medium text-ink-soft transition hover:text-pine"
              >
                All printables →
              </Link>
            </div>
            <div className="mt-10 max-w-lg">
              <ResourceCard
                resource={featuredPrintable}
                previewVariant="card"
                variant="featured"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section id="shop" className="scroll-mt-20 border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 section-pad sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                Shop
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Club goods
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Crest, pup, and the rest. Optional. Printed after you check out.
              </p>
            </div>
            <Link
              href="/shop"
              className="shrink-0 text-sm font-medium text-ink-soft transition hover:text-pine"
            >
              Browse all →
            </Link>
          </div>
          {shopPicks.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shopPicks.map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink-soft">
              Shop is warming up.{" "}
              <Link href="/shop" className="font-medium text-pine hover:text-rust">
                Check back soon →
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
