"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ColorSwatches } from "@/components/color-swatches";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import {
  POD_SHIPPING_COPY,
  productMaterialNote,
} from "@/lib/product-display";
import {
  findVariant,
  initialSize,
  productColors,
  productNeedsSize,
  productSizes,
  type Product,
} from "@/lib/products";

const ANGLE_LABELS: Record<string, string> = {
  front: "Front",
  lifestyle: "On a dad",
  back: "Back",
};

export function ProductDetail({ product }: { product: Product }) {
  const colors = productColors(product);
  const [color, setColor] = useState(colors[0] ?? "");
  const [angle, setAngle] = useState("front");
  const sizes = productSizes(product, color || undefined);
  const needsSize = productNeedsSize(product) || sizes.length > 0;
  const [size, setSize] = useState(initialSize(product, sizes));
  const material = productMaterialNote(product);

  const selected = findVariant(product, {
    size: needsSize ? size || undefined : undefined,
    color: color || undefined,
  });

  useEffect(() => {
    if (!sizes.length) return;
    if (!sizes.includes(size)) {
      setSize(initialSize(product, sizes) || sizes[0]);
    }
  }, [size, sizes]);

  const colorPhotos = useMemo(() => {
    const photos = product.images ?? [];
    const forColor = photos.filter(
      (photo) => !photo.color || photo.color === color,
    );
    return forColor.length ? forColor : photos;
  }, [product.images, color]);

  const activePhoto = useMemo(() => {
    return (
      colorPhotos.find((photo) => photo.angle === angle) ??
      colorPhotos.find((photo) => photo.angle === "front") ??
      colorPhotos[0]
    );
  }, [colorPhotos, angle]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pine transition hover:text-rust"
        >
          ← Back to shop
        </Link>
      </p>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-3xl border border-rule bg-paper">
            {activePhoto ? (
              <Image
                src={activePhoto.src}
                alt={`${product.name}${color ? ` in ${color}` : ""}`}
                width={1200}
                height={1200}
                className="aspect-square h-auto w-full object-cover"
                priority
              />
            ) : (
              <div className="aspect-square">
                <ProductMedia product={product} />
              </div>
            )}
          </div>
          {colorPhotos.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {colorPhotos.map((photo) => {
                const selectedAngle = (activePhoto?.src ?? "") === photo.src;
                return (
                  <button
                    key={`${photo.color}-${photo.angle}-${photo.src}`}
                    type="button"
                    onClick={() => setAngle(photo.angle)}
                    aria-pressed={selectedAngle}
                    className={`overflow-hidden rounded-xl border ${
                      selectedAngle
                        ? "border-pine ring-2 ring-pine/30"
                        : "border-rule"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={ANGLE_LABELS[photo.angle] ?? photo.angle}
                      width={160}
                      height={160}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.18em] text-rust">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl">
            {formatMoney(selected?.price_cents ?? product.price_cents)}
          </p>
          {material ? (
            <p className="mt-2 text-sm text-ink-soft">{material}</p>
          ) : null}
          <p className="mt-6 max-w-lg text-lg leading-8 text-ink-soft">
            {product.description}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-6 text-ink-soft">
            Proceeds fund the{" "}
            <Link
              href="/guides/the-dad-tax"
              className="font-medium text-pine hover:text-rust"
            >
              guides
            </Link>
            . {POD_SHIPPING_COPY}
          </p>
          {colors.length > 1 ? (
            <div className="mt-6">
              <p className="text-sm text-ink-soft">Color: {color}</p>
              <div className="mt-2">
                <ColorSwatches
                  colors={colors}
                  selected={color}
                  onSelect={(next) => {
                    setColor(next);
                    setAngle("front");
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="mt-8">
            <AddToCartButton
              product={product}
              color={color}
              size={size}
              onColorChange={(next) => {
                setColor(next);
                setAngle("front");
              }}
              onSizeChange={setSize}
              hideColorSelect
              showSizeGuide
            />
            <p className="mt-4">
              <Link
                href="/cart"
                className="text-sm font-medium text-pine hover:text-rust"
              >
                View cart →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
