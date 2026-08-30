"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ColorSwatches } from "@/components/color-swatches";
import { useCart } from "@/components/cart-provider";
import { SizeGuideLink } from "@/components/size-guide";
import { trackShopAddToCart } from "@/lib/analytics";
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
  compact = false,
  showSizeGuide = false,
}: {
  product: Product;
  color?: string;
  size?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  hideColorSelect?: boolean;
  compact?: boolean;
  showSizeGuide?: boolean;
}) {
  const { addItem } = useCart();
  const colors = productColors(product);
  const [internalColor, setInternalColor] = useState(colors[0] ?? "");
  const color = controlledColor ?? internalColor;
  const sizes = productSizes(product, color || undefined);
  const needsSize = productNeedsSize(product) || sizes.length > 0;
  const sizeOptions = sizes.length ? sizes : needsSize ? [...APPAREL_SIZES] : [];
  const [internalSize, setInternalSize] = useState(
    () => initialSize(product, sizeOptions) || "",
  );
  const [sizeTouched, setSizeTouched] = useState(false);
  const size = controlledSize ?? internalSize;
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sizeOptions.length) return;
    if (!sizeOptions.includes(size)) {
      setSize(initialSize(product, sizeOptions) || sizeOptions[0]);
    }
    // Re-sync when color changes available sizes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, product.id, sizeOptions.join("|")]);

  function setSize(next: string) {
    setSizeTouched(true);
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

  const sizeReady = !needsSize || Boolean(size);
  const canAdd = sizeReady && (!product.variants?.length || Boolean(selected));

  const buttonLabel = (() => {
    if (added) return "Added to cart";
    if (needsSize && !size) return "Pick a size";
    if (needsSize && size && color) return `Add ${size} · ${color}`;
    if (needsSize && size) return `Add size ${size}`;
    return compact ? "Add to cart" : "Add to cart";
  })();

  return (
    <div className={compact ? "space-y-2.5" : "space-y-4"}>
      {colors.length > 1 && !hideColorSelect ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-ink-soft">
            Color{color ? `: ${color}` : ""}
          </p>
          <ColorSwatches
            colors={colors}
            selected={color}
            onSelect={setColor}
            size={compact ? "sm" : "md"}
          />
        </div>
      ) : null}

      {needsSize ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-ink-soft">
              Size{size ? `: ${size}` : " (required)"}
            </p>
            {showSizeGuide || product.art === "tee" || product.art === "hoodie" ? (
              <SizeGuideLink />
            ) : null}
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Select size"
          >
            {sizeOptions.map((option) => {
              const active = option === size;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSize(option)}
                  className={
                    active
                      ? "min-w-10 rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper ring-2 ring-ink ring-offset-1 ring-offset-paper"
                      : "min-w-10 rounded-full border border-rule bg-paper px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
          {needsSize && !sizeTouched && !size ? (
            <p className="mt-1.5 text-xs text-ink-soft">Select a size to add.</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canAdd && !added}
          onClick={() => {
            if (needsSize && !size) {
              setMessage("Pick a size first.");
              return;
            }
            if (product.variants?.length && !selected) {
              setMessage("That size and color is not in stock.");
              return;
            }
            setMessage("");
            trackShopAddToCart(
              product.slug,
              selected?.price_cents ?? product.price_cents,
            );
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
            window.setTimeout(() => setAdded(false), 1800);
          }}
          className={
            added
              ? compact
                ? "rounded-full bg-pine px-4 py-2 text-sm font-semibold text-paper"
                : "rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper"
              : canAdd
                ? compact
                  ? "rounded-full bg-rust px-4 py-2 text-sm font-semibold text-paper hover:bg-rust-2"
                  : "rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2"
                : compact
                  ? "rounded-full bg-ink/15 px-4 py-2 text-sm font-semibold text-ink-soft"
                  : "rounded-full bg-ink/15 px-5 py-3 text-sm font-semibold text-ink-soft"
          }
        >
          {buttonLabel}
        </button>
        {added ? (
          <Link
            href="/cart"
            className="text-sm font-medium text-pine hover:text-rust"
          >
            View cart →
          </Link>
        ) : null}
      </div>
      {message ? <p className="text-sm text-rust">{message}</p> : null}
    </div>
  );
}
