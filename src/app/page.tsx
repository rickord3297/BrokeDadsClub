import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { ProductCard } from "@/components/product-card";
import { ResourceCard } from "@/components/resource-card";
import { SiteTagline } from "@/components/site-tagline";
import { TopicPills } from "@/components/topic-pills";
import {
  START_HERE_SLUGS,
  getGuide,
  getGuideCategories,
  getGuides,
} from "@/lib/guides";
import { getHomeShopProducts } from "@/lib/products";
import { getResource } from "@/lib/resources";

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
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 lg:pt-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-rust/30 bg-rust/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rust-2">
              Guides for stretched-thin dads
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Raising kids.
              <br />
              Stretching dollars.
              <br />
              Still showing up.
            </h1>
            <SiteTagline size="hero" className="mt-5 max-w-xl" />
          </div>
        </div>

        <div
          id="start-here"
          className="scroll-mt-20 border-t border-pine/15 bg-pine/[0.05]"
        >
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                  Start here
                </p>
                <h2 className="mt-1 font-display text-3xl sm:text-[2rem]">
                  Four guides that pay rent
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                  Everything else lives on the guides page.
                </p>
              </div>
              <Link
                href="/guides"
                className="shrink-0 text-sm font-medium text-pine transition hover:text-rust"
              >
                All guides →
              </Link>
            </div>

            {categories.length > 0 ? (
              <div className="mt-5">
                <TopicPills categories={categories} size="lg" variant="tabs" />
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </section>

      <InlineEmailBar
        source="homepage-inline"
        successHref="/resources/grocery-week-checklist"
        successLinkLabel="Print the grocery checklist"
      />

      {featuredPrintable ? (
        <section id="printables" className="scroll-mt-20 border-t border-rule bg-paper-2/40">
          <div className="mx-auto max-w-6xl px-4 section-pad-sm sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                  Printables
                </p>
                <h2 className="mt-1 font-display text-3xl sm:text-[2rem]">
                  One sheet for the fridge
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                  Start with the grocery-week checklist.{" "}
                  <Link
                    href="/resources"
                    className="font-medium text-ink-soft underline decoration-rule underline-offset-2 hover:text-pine"
                  >
                    More printables
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-6 max-w-lg">
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
        <div className="mx-auto max-w-6xl px-4 section-pad-sm sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                Shop
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-[2rem]">
                Club goods
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                Crest, pup, and the rest. Optional. Printed after you check out.
              </p>
            </div>
            <Link
              href="/shop"
              className="shrink-0 text-sm font-medium text-pine transition hover:text-rust"
            >
              Browse all →
            </Link>
          </div>
          {shopPicks.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shopPicks.map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">
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
