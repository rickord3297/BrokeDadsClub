import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { ProductCard } from "@/components/product-card";
import { getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export default async function Home() {
  const [guides, products] = await Promise.all([getGuides(), getProducts()]);

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rust">
              A club for the stretched-thin
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Raising kids.
              <br />
              Stretching dollars.
              <br />
              Still showing up.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              {site.name} is two things on purpose: a content desk with useful
              dad tactics, and a shop that funds the work. {site.tagline}
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
                className="rounded-full border border-ink px-5 py-3 text-sm font-semibold hover:bg-ink hover:text-paper"
              >
                Shop the club
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-rule bg-paper-2 p-6 sm:p-8">
            <p className="font-stamp text-sm uppercase tracking-[0.2em] text-pine">
              This week&apos;s mix
            </p>
            <ul className="mt-6 space-y-5">
              {[
                ["01", "Money", "Feed a family without the shame spiral."],
                ["02", "Time", "Date night that doesn't need a sitter and a second mortgage."],
                ["03", "Gear", "Merch that pays for the next article."],
              ].map(([num, label, copy]) => (
                <li key={num} className="flex gap-4">
                  <span className="font-stamp text-2xl text-gold">{num}</span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
                      {label}
                    </p>
                    <p className="mt-1 font-display text-xl leading-snug">{copy}</p>
                  </div>
                </li>
              ))}
            </ul>
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
