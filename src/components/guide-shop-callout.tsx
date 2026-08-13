import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { getProduct } from "@/lib/products";

export async function GuideShopCallout({ slugs }: { slugs: string[] }) {
  const products = (
    await Promise.all(slugs.map((slug) => getProduct(slug)))
  ).filter((product) => product != null);

  if (!products.length) return null;

  return (
    <aside className="mt-10 rounded-2xl border border-pine/20 bg-pine px-5 py-6 text-paper sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        Club goods
      </p>
      <p className="mt-2 font-display text-2xl">Wear the club. Fund the next guide.</p>
      <ul className="mt-4 space-y-3">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/shop/${product.slug}`}
              className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-3 text-sm hover:text-gold"
            >
              <span>{product.name}</span>
              <span className="shrink-0 text-paper/80">
                {formatMoney(product.price_cents)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/shop"
        className="mt-4 inline-block text-sm font-medium text-gold hover:text-paper"
      >
        Browse the shop →
      </Link>
    </aside>
  );
}
