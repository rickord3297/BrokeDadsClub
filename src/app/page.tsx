import Image from "next/image";
import Link from "next/link";
import { ChecklistSignup } from "@/components/checklist-signup";
import { GuideCard } from "@/components/guide-card";
import { ProductCard } from "@/components/product-card";
import { ResourceCard } from "@/components/resource-card";
import { TopicPills } from "@/components/topic-pills";
import { getGuideCategories, getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

const productOrder = ["club-pup-tee", "club-patch", "candy-stripe-patch"];

export default async function Home() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);
  const categories = getGuideCategories(guides);
  const featuredProducts = productOrder
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => product != null);

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
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
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              {site.name} is a content desk for dads doing the math out loud.
              Practical guides first. Club goods that fund the next one.{" "}
              {site.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/guides"
                className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper hover:bg-pine-2"
              >
                Read the guides
              </Link>
              <Link
                href="/resources"
                className="rounded-full border border-ink px-5 py-3 text-sm font-semibold hover:bg-ink hover:text-paper"
              >
                Free printables
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-ink px-5 py-3 text-sm font-semibold hover:bg-ink hover:text-paper"
              >
                Shop the club
              </Link>
            </div>
            <div className="mt-8 max-w-md">
              <ChecklistSignup source="homepage-hero" compact />
            </div>
          </div>

          <aside className="flex flex-col items-center justify-center text-center">
            <Image
              src="/brand/club-logo.png"
              alt="Broke Dads Club crest, castle, crowns, and the club name"
              width={420}
              height={420}
              priority
              className="h-auto w-full max-w-[380px]"
            />
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              The official crest. A castle you cannot afford, and a club you can.
            </p>
            <Link
              href="/guides/the-dad-tax"
              className="mt-3 text-sm font-medium text-pine hover:text-rust"
            >
              Start with the dad tax →
            </Link>
          </aside>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="border-b border-rule">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              Topics
            </p>
            <TopicPills categories={categories} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
            <h2 className="mt-2 font-display text-4xl">Good information for dads</h2>
          </div>
          <Link href="/guides" className="text-sm font-medium text-pine hover:text-rust">
            All guides →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-rust">
                Printables
              </p>
              <h2 className="mt-2 font-display text-4xl">Printables for the fridge</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Checklists and worksheets. No email wall. Print them, or save as
                a PDF.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-sm font-medium text-pine hover:text-rust"
            >
              All printables →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-rust">Shop</p>
                <h2 className="mt-2 font-display text-4xl">Club goods</h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                  Proceeds fund independent tactics and guides for parents. Wear the
                  club. Keep the desk open.
                </p>
              </div>
              <Link href="/shop" className="text-sm font-medium text-pine hover:text-rust">
                Full shop →
              </Link>
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
