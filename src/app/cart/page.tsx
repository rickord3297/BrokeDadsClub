import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Checkout</p>
      <h1 className="mt-3 font-display text-5xl">Your cart</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
