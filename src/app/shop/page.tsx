import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Broke Dads Club merch — castle patches, the block-castle tee, hoodies, and gear that fund the guides.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Club goods</p>
      <h1 className="mt-3 font-display text-5xl">The shop</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Wear the club. Fund the desk. Every order helps keep the guides free.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
