import Link from "next/link";
import { WeekStartSignup } from "@/components/week-start-signup";
import { GuideCard } from "@/components/guide-card";
import { ProductCard } from "@/components/product-card";
import { ResourceCard } from "@/components/resource-card";
import { TopicPills } from "@/components/topic-pills";
import { START_HERE_SLUGS, getGuide, getGuideCategories, getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

const productOrder = ["club-pup-tee"];
const HERO_GUIDE_SLUG = "the-second-bill";

export default async function Home() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);
  const categories = getGuideCategories(guides);
  const heroGuide = getGuide(HERO_GUIDE_SLUG) ?? guides[0] ?? null;
  const alsoNew =
    guides.find((guide) => guide.slug !== heroGuide?.slug) ?? null;
  const startHere = START_HERE_SLUGS.map((slug) => getGuide(slug)).filter(
    (guide): guide is NonNullable<typeof guide> => guide != null,
  );
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
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            Practical guides for dads doing the math out loud. {site.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {heroGuide ? (
              <Link
                href={`/guides/${heroGuide.slug}`}
                className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper hover:bg-pine-2"
              >
                Read: The second bill
              </Link>
            ) : (
              <Link
                href="/guides"
                className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper hover:bg-pine-2"
              >
                Read the guides
              </Link>
            )}
            <Link
              href="/guides"
              className="text-sm font-semibold text-pine hover:text-rust"
            >
              All guides →
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-ink-soft hover:text-rust"
            >
              Free printables
            </Link>
          </div>
        </div>
      </section>

      {alsoNew ? (
        <section className="border-b border-rule bg-paper-2/50">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rust">
                Also new
              </p>
              <p className="mt-1 font-display text-2xl leading-tight">{alsoNew.title}</p>
            </div>
            <Link
              href={`/guides/${alsoNew.slug}`}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2"
            >
              Read the guide
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
            <h2 className="mt-2 font-display text-4xl">Start here</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
              Why everything costs more, the August supply trap, and the fees that
              hit after school starts.
            </p>
          </div>
          <Link href="/guides" className="text-sm font-medium text-pine hover:text-rust">
            All guides →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {startHere.map((guide) => (
            <GuideCard
              key={guide.slug}
              guide={guide}
              badge={
                guide.slug === "the-dad-tax"
                  ? "Most popular"
                  : guide.slug === "the-second-bill"
                    ? "New"
                    : "Start here"
              }
            />
          ))}
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="border-t border-rule">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              Browse by topic
            </p>
            <TopicPills categories={categories} />
          </div>
        </section>
      ) : null}

      <section className="border-t border-rule">
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
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section id="sunday-email" className="border-t border-rule bg-paper-2/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
          <WeekStartSignup source="homepage-sunday" />
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
                  The crest is the membership card. The pup and the penguin are
                  the pickup-line jokes. Sales keep the{" "}
                  <Link href="/guides" className="font-medium text-pine hover:text-rust">
                    guides
                  </Link>{" "}
                  free.
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
