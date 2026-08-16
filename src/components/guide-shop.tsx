import { ProductCard } from "@/components/product-card";
import { getProductsBySlugs } from "@/lib/products";

export async function GuideShop({ slugs }: { slugs: string[] }) {
  const products = await getProductsBySlugs(slugs);
  if (!products.length) return null;

  return (
    <aside className="mt-12 border-t border-rule pt-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        Club goods
      </p>
        <h2 className="mt-2 font-display text-3xl">Sales keep the guides free</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
          Wear the club. Pickup-line readable. No hustle slogan.
        </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </aside>
  );
}
