import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop-explorer";
import { POD_SHIPPING_COPY } from "@/lib/product-display";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Broke Dads Club merch: tees, hats, and pins. Printed after you check out. Ships in 3-5 business days.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Club goods</p>
      <h1 className="mt-3 font-display text-5xl">The shop</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Crest, pup, penguin, and the rest. {POD_SHIPPING_COPY}
      </p>
      <ShopExplorer products={products} />
    </div>
  );
}
