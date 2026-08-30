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
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter shop by category"
      >
        {SHOP_FILTERS.map((item) => {
          const selected = filter === item.id;
          const count = counts[item.id];
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
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {pin && filter === "all" ? <CastlePinUpsell product={pin} /> : null}
    </>
  );
}

export function CastlePinUpsell({ product }: { product: Product }) {
  const image = product.images?.[0]?.src ?? product.image;

  return (
    <aside className="mt-10 rounded-2xl border border-gold/30 bg-gold/[0.08] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {image ? (
          <Link
            href={`/shop/${product.slug}`}
            className="mx-auto block h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-rule bg-paper sm:mx-0"
          >
            <Image
              src={image}
              alt={product.name}
              width={192}
              height={192}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            Easy add-on · {formatMoney(product.price_cents)}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-snug">
            <Link href={`/shop/${product.slug}`} className="hover:text-rust">
              {product.name}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Low-cost club crest for the jacket that has seen every school
            drop-off. Toss it in with a tee.
          </p>
        </div>
        <div className="shrink-0 sm:min-w-[10rem]">
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </aside>
  );
}
