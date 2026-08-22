import Link from "next/link";
import { HomeGuidesSection } from "@/components/home-guides-section";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { ProductCard } from "@/components/product-card";
import { ResourceCard } from "@/components/resource-card";
import { getGuideCategories, getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

const productOrder = ["club-pup-tee"];

export default async function Home() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);
  const categories = getGuideCategories(guides);
  const homeGuides = guides.map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    category: guide.category,
    readTime: guide.readTime,
    publishedAt: guide.publishedAt,
  }));
  const featuredProducts = [
    ...productOrder.flatMap((slug) => {
      const product = products.find((item) => item.slug === slug);
      return product ? [product] : [];
    }),
    ...products.filter((product) => !productOrder.includes(product.slug)),
  ];

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pine">
            A place for the stretched-thin dads doing their best
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Raising kids.
            <br />
            Stretching dollars.
            <br />
            Still showing up.
          </h1>
          <p className="mt-5 inline-flex items-center rounded-full border border-pine/30 bg-pine/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pine">
            No email wall · 100% free
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            Practical guides for dads doing the math out loud.
          </p>
          <p className="mt-4 font-display text-2xl text-rust sm:text-3xl">
            {site.tagline}
          </p>
        </div>
      </section>

      <HomeGuidesSection guides={homeGuides} categories={categories} />

      <InlineEmailBar source="homepage-inline" />

      <section id="printables" className="border-t border-rule scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-rust">
                Printables
              </p>
              <h2 className="mt-2 font-display text-4xl">Printables for the fridge</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Checklists that pair with the guides. Free, no email wall.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-sm font-medium text-pine hover:text-rust"
            >
              All printables →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                previewVariant={
                  resource.slug === "grocery-week-checklist" ||
                  resource.slug === "school-supply-triage"
                    ? "fridge"
                    : "sheet"
                }
              />
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section id="shop" className="border-t border-rule scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-rust">Shop</p>
                <h2 className="mt-2 font-display text-4xl">Club goods</h2>
              </div>
              <Link href="/shop" className="text-sm font-medium text-pine hover:text-rust">
                Full shop →
              </Link>
            </div>
            <div className="mt-6 rounded-2xl border border-pine/30 bg-pine/5 px-5 py-5 text-center sm:px-8">
              <p className="font-display text-2xl text-pine sm:text-3xl">
                Sales fund free guides.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft sm:text-base">
                The crest is the membership card. The pup and the penguin are the
                pickup-line jokes. Every purchase keeps the tactics free for every
                dad.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
