"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { formatMoney } from "@/lib/format";
import {
  CASTLE_PIN_SLUG,
  SHOP_FILTERS,
  filterShopProducts,
  isPremiumProduct,
  shopFilterCounts,
  type ShopFilterId,
} from "@/lib/product-display";
import type { Product } from "@/lib/products";

export function ShopExplorer({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<ShopFilterId>("all");
  const counts = useMemo(() => shopFilterCounts(products), [products]);
  const filtered = useMemo(
    () => filterShopProducts(products, filter),
    [products, filter],
  );
  const pin = products.find((product) => product.slug === CASTLE_PIN_SLUG);

  return (
    <>
      {pin ? <CastlePinUpsell product={pin} /> : null}

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter shop by category"
      >
        {SHOP_FILTERS.map((item) => {
          const selected = filter === item.id;
          const count = counts[item.id];
          if (item.id !== "all" && count === 0) return null;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={
                selected
                  ? "rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm ring-2 ring-ink ring-offset-2 ring-offset-paper"
                  : "rounded-full border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
              }
            >
              {item.label}
              <span
                className={
                  selected
                    ? "ml-1.5 tabular-nums text-paper/70"
                    : "ml-1.5 tabular-nums text-ink-soft"
                }
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-base text-ink-soft">
          Nothing in that category yet.{" "}
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="font-medium text-pine hover:text-rust"
          >
            Show all
          </button>
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={isPremiumProduct(product) ? "Premium" : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function CastlePinUpsell({ product }: { product: Product }) {
  const image = product.images?.[0]?.src ?? product.image;
  const sizeNote = product.defaultSize ? `${product.defaultSize} enamel pin` : "Enamel pin";

  return (
    <aside
      aria-labelledby="castle-pin-callout"
      className="mt-8 rounded-2xl border border-gold/40 bg-gold/[0.08] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {image ? (
            <Link
              href={`/shop/${product.slug}`}
              className="block h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-rule bg-paper sm:h-20 sm:w-20"
            >
              <Image
                src={image}
                alt={product.name}
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </Link>
          ) : null}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine">
              {product.name} · {formatMoney(product.price_cents)}
            </p>
            <h2
              id="castle-pin-callout"
              className="mt-0.5 font-display text-xl leading-snug sm:text-2xl"
            >
              Join the Club for $5
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              Want to back the mission without buying a tee? Grab the official
              enamel pin to toss on your pack or jacket.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <AddToCartButton
            product={product}
            compact
            quickAdd
            label={`Add pin · ${formatMoney(product.price_cents)}`}
          />
          <p className="mt-1.5 text-xs text-ink-soft">{sizeNote}</p>
        </div>
      </div>
    </aside>
  );
}
