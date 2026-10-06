import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { CASTLE_PIN_SLUG } from "@/lib/product-display";
import { getProduct } from "@/lib/products";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cart",
  ...NOINDEX,
};

export default async function CartPage() {
  const upsellProduct = await getProduct(CASTLE_PIN_SLUG);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Checkout</p>
      <h1 className="mt-3 font-display text-5xl">Your cart</h1>
      <div className="mt-8">
        <CartView upsellProduct={upsellProduct} />
      </div>
    </div>
  );
}
