import Link from "next/link";
import { GatedResourceCard } from "@/components/gated-resource-card";
import { HomeGuidesSection } from "@/components/home-guides-section";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { isPremiumProduct } from "@/lib/product-display";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import {
  getGuides,
  toGuideListItem,
} from "@/lib/guides";
import { getHomeShopProducts } from "@/lib/products";
import { getResource } from "@/lib/resources";

const FEATURED_PRINTABLE = "grocery-week-checklist";

export default async function Home() {
  const guides = getGuides();
  const list = guides.map((guide) => {
    const tieIn = resourceTieInForGuide(guide.slug);
    return toGuideListItem(
      guide,
      tieIn ? { href: tieIn.href, label: tieIn.label } : null,
    );
  });
  const featuredPrintable = getResource(FEATURED_PRINTABLE);
  const shopPicks = await getHomeShopProducts();

  return (
    <div>
      <HomeHero />

      <HomeGuidesSection guides={list} />

      {featuredPrintable ? (
        <section
          id="printables"
          className="scroll-mt-20 border-t border-rule bg-paper-2/40"
        >
          <div className="mx-auto max-w-6xl px-4 section-pad-sm sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
                Printables
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-[2rem]">
                One sheet for the fridge
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                Preview the grocery-week checklist below. Sign up for the full
                fillable PDF and Sunday guide drops.
              </p>
            </div>
            <div className="mt-6">
              <GatedResourceCard resource={featuredPrintable} />
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
                Club wear
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                Garment-dyed tees, fleece, and totes in washed earth tones.
                Sales fund new free guides and open tools.
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
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shopPicks.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="featured"
                  badge={isPremiumProduct(product) ? "Premium" : undefined}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">
              Shop is warming up.{" "}
              <Link
                href="/shop"
                className="font-medium text-pine hover:text-rust"
              >
                Check back soon →
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
