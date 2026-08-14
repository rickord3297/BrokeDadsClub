import Image from "next/image";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

const productOrder = ["club-patch", "block-castle-tee", "candy-stripe-patch"];

export default async function Home() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);
  const featuredProducts = productOrder
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => product != null);

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rust">
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/guides"
                className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper hover:bg-pine-2"
              >
                Read the guides
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2"
              >
                Shop the club
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Or grab the{" "}
              <Link
                href="/resources/grocery-week-checklist"
                className="font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust"
              >
                free $47 grocery-week checklist
              </Link>
              .
            </p>
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

      <section className="border-y border-rule bg-paper-2/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rust">
              Weekly recap
            </p>
            <h2 className="mt-2 font-display text-4xl">
              Get a weekly recap of new content.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-ink-soft">
              One email when a new guide (or a useful update) goes up. Quiet
              weeks stay quiet. Unsubscribe whenever.
            </p>
          </div>
          <div>
            <NewsletterForm
              variant="article"
              source="homepage-recap"
              submitLabel="Get the recap"
            />
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
        </section>
      ) : null}
    </div>
  );
}
