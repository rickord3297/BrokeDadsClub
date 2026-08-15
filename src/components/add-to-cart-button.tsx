"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  APPAREL_SIZES,
  findVariant,
  productColors,
  productNeedsSize,
  productSizes,
  type Product,
} from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const sizes = productSizes(product);
  const colors = productColors(product);
  const needsSize = productNeedsSize(product) || sizes.length > 0;
  const [size, setSize] = useState(
    sizes.includes("L") ? "L" : (sizes[0] ?? APPAREL_SIZES[2]),
  );
  const [color, setColor] = useState(colors[0] ?? "");
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");

  const selected = useMemo(
    () =>
      findVariant(product, {
        size: needsSize ? size : undefined,
        color: color || undefined,
      }),
    [product, needsSize, size, color],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {colors.length > 1 ? (
          <label className="text-sm text-ink-soft">
            Color
            <select
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="ml-2 rounded-md border border-rule bg-paper px-2 py-2"
            >
              {colors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {needsSize ? (
          <label className="text-sm text-ink-soft">
            Size
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="ml-2 rounded-md border border-rule bg-paper px-2 py-2"
            >
              {(sizes.length ? sizes : [...APPAREL_SIZES]).map((option) => (
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
            if (product.variants?.length && !selected) {
              setMessage("That size and color is not in stock.");
              return;
            }
            setMessage("");
            addItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price_cents: selected?.price_cents ?? product.price_cents,
              art: product.art,
              size: needsSize ? size : undefined,
              color: color || undefined,
              sku: selected?.sku,
            });
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
          className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
      {message ? <p className="text-sm text-rust">{message}</p> : null}
    </div>
  );
}
