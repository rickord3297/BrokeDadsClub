import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import groceryPdfPreview from "../../public/lead-magnets/grocery-reset-trunk-kit-preview.jpg";
import { GatedResourceCard } from "@/components/gated-resource-card";
import { HomeFinalSignup } from "@/components/home-final-signup";
import { HomeFollowSection } from "@/components/home-follow-section";
import { HomeGuidesSection } from "@/components/home-guides-section";
import { HomeHero } from "@/components/home-hero";
import {
  WelcomeBackBanner,
  type WelcomeBackItem,
} from "@/components/welcome-back-banner";
import { ProductCard } from "@/components/product-card";
import { isPremiumProduct } from "@/lib/product-display";
import { resourceTieInForGuide } from "@/lib/guide-catalog";
import { getLiveResources } from "@/lib/printables";
import {
  getGuides,
  toGuideListItem,
} from "@/lib/guides";
import { formatIssueNumber, getLatestIssue } from "@/lib/newsletter";
import { getHomeShopProducts } from "@/lib/products";
import { getResource } from "@/lib/resources";
import { buildPageMetadata, GROCERY_LIST_OG_IMAGE } from "@/lib/seo";
import { site } from "@/lib/site";

function pickWelcomeBackItem(
  guides: ReturnType<typeof getGuides>,
): WelcomeBackItem | null {
  const latestGuide = guides[0] ?? null;
  const latestIssue = getLatestIssue();
  const guideDate = latestGuide ? Date.parse(`${latestGuide.publishedAt}T00:00:00.000Z`) : 0;
  const issueDate = latestIssue ? Date.parse(`${latestIssue.publishedAt}T00:00:00.000Z`) : 0;

  if (latestIssue && issueDate >= guideDate) {
    return {
      kind: "newsletter",
      slug: latestIssue.slug,
      title: latestIssue.title,
      href: `/newsletter/${latestIssue.slug}`,
      publishedAt: latestIssue.publishedAt,
      kicker: `${formatIssueNumber(latestIssue.issueNumber)} · Sunday Dispatch`,
    };
  }
  if (!latestGuide) return null;
  return {
    kind: "guide",
    slug: latestGuide.slug,
    title: latestGuide.title,
    href: `/guides/${latestGuide.slug}`,
    publishedAt: latestGuide.publishedAt,
    kicker: `${latestGuide.category} · ${latestGuide.readTime}`,
  };
}

const FEATURED_PRINTABLE = "grocery-week-checklist";

export const metadata: Metadata = buildPageMetadata({
  title: "Broke Dads Club | Practical Budget Guides & Free Family Printables",
  description:
    "Free meal plans, grocery checklists, and tactical money guides for dads raising a family on a tight budget. Real math, zero financial shame.",
  path: "/",
  keywords: site.keywords,
  absoluteTitle: true,
  images: [GROCERY_LIST_OG_IMAGE],
});

export default async function Home() {
  const liveResources = getLiveResources();
  const guides = getGuides();
  const list = guides.map((guide) => {
    const tieIn = resourceTieInForGuide(guide.slug, liveResources);
    return toGuideListItem(
      guide,
      tieIn ? { href: tieIn.href, label: tieIn.label } : null,
    );
  });
  const featuredPrintable = getResource(FEATURED_PRINTABLE);
  const shopPicks = await getHomeShopProducts();

  const welcomeBack = pickWelcomeBackItem(guides);

  return (
    <div>
      <WelcomeBackBanner latest={welcomeBack} />
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
                The whole one-page PDF: the cart, the week, the swaps. Sign up
                and it lands in your inbox, plus the Sunday drop.
              </p>
            </div>
            <div className="mt-6">
              <GatedResourceCard
                resource={featuredPrintable}
                preview={
                  <Image
                    src={groceryPdfPreview}
                    alt="The full one-page grocery list PDF: a 14-item Walmart cart, the week's seven dinners, swaps, and a trunk snack kit."
                    sizes="(min-width: 640px) 28rem, 90vw"
                    className="w-full max-w-md rounded-md border border-rule shadow-sm"
                  />
                }
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

      <HomeFinalSignup />

      <HomeFollowSection />
    </div>
  );
}