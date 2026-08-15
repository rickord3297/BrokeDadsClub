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
      <h2 className="mt-2 font-display text-3xl">Funds the next guide</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
        Soft merch, same desk. Proceeds keep the tactics free.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </aside>
  );
}
