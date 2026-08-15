"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  APPAREL_SIZES,
  findVariant,
  initialSize,
  productColors,
  productNeedsSize,
  productSizes,
  type Product,
} from "@/lib/products";

export function AddToCartButton({
  product,
  color: controlledColor,
  size: controlledSize,
  onColorChange,
  onSizeChange,
  hideColorSelect = false,
}: {
  product: Product;
  color?: string;
  size?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  hideColorSelect?: boolean;
}) {
  const { addItem } = useCart();
  const colors = productColors(product);
  const [internalColor, setInternalColor] = useState(colors[0] ?? "");
  const color = controlledColor ?? internalColor;
  const sizes = productSizes(product, color || undefined);
  const needsSize = productNeedsSize(product) || sizes.length > 0;
  const [internalSize, setInternalSize] = useState(
    initialSize(product, sizes) || APPAREL_SIZES[2],
  );
  const size = controlledSize ?? internalSize;
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sizes.length) return;
    if (!sizes.includes(size)) {
      setSize(initialSize(product, sizes) || sizes[0]);
    }
  }, [size, sizes]);

  function setSize(next: string) {
    if (onSizeChange) onSizeChange(next);
    else setInternalSize(next);
  }

  const selected = useMemo(
    () =>
      findVariant(product, {
        size: needsSize ? size : undefined,
        color: color || undefined,
      }),
    [product, needsSize, size, color],
  );

  function setColor(next: string) {
    if (onColorChange) onColorChange(next);
    else setInternalColor(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {colors.length > 1 && !hideColorSelect ? (
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
