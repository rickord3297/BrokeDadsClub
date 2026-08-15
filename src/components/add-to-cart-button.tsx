"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { APPAREL_SIZES, productNeedsSize, type Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const needsSize = productNeedsSize(product);
  const [size, setSize] = useState<(typeof APPAREL_SIZES)[number]>("L");
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {needsSize ? (
        <label className="text-sm text-ink-soft">
          Size
          <select
            value={size}
            onChange={(event) =>
              setSize(event.target.value as (typeof APPAREL_SIZES)[number])
            }
            className="ml-2 rounded-md border border-rule bg-paper px-2 py-2"
          >
            {APPAREL_SIZES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button
        type="button"
        onClick={() => {
          addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price_cents: product.price_cents,
            art: product.art,
            size: needsSize ? size : undefined,
          });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
