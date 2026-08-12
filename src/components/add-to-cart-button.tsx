"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price_cents: product.price_cents,
          art: product.art,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2"
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
