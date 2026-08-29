import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import { productMaterialNote } from "@/lib/product-display";
import {
  productNeedsSize,
  productPriceRange,
  productSizes,
  type Product,
} from "@/lib/products";

export function ProductCard({
  product,
  badge,
  variant = "default",
}: {
  product: Product;
  badge?: string;
  variant?: "default" | "featured";
}) {
  const range = productPriceRange(product);
  const priceLabel =
    range.max > range.min
      ? `From ${formatMoney(range.min)}`
      : formatMoney(product.price_cents);
  const sizes = productSizes(product);
  const material = productMaterialNote(product);
  const featured = variant === "featured";
  const hoverClass =
    "transition hover:-translate-y-1 hover:border-pine/50 hover:shadow-lg hover:shadow-ink/10";

  if (featured) {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-rule bg-paper ${hoverClass}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2/50">
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-md border border-rule bg-paper px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {badge}
            </span>
          ) : null}
          <ProductMedia product={product} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rust">
            {product.category}
          </p>
          <h3 className="mt-1 min-h-[3.5rem] font-display text-xl leading-snug transition group-hover:text-rust">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-ink">{priceLabel}</p>
          {material ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-soft">
              {material}
            </p>
          ) : (
            <p className="mt-1 min-h-[2.5rem]" aria-hidden />
          )}
          <span className="mt-auto pt-4 text-sm font-semibold text-pine transition group-hover:text-rust">
            View product →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-2 ${hoverClass}`}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group flex flex-1 cursor-pointer flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-paper">
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-pine px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
              {badge}
            </span>
          ) : null}
          {productNeedsSize(product) && sizes.length > 0 ? (
            <span className="absolute right-3 top-3 z-10 rounded-md border border-rule bg-paper/95 px-2 py-1 text-[10px] font-medium text-ink-soft">
              {sizes.length} sizes
            </span>
          ) : null}
          <ProductMedia product={product} />
        </div>
        <div className="space-y-1 px-4 pb-3 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rust">
            {product.category}
          </p>
          <h3 className="font-display text-xl transition group-hover:text-rust">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-ink">{priceLabel}</p>
          {material ? (
            <p className="text-xs leading-5 text-ink-soft">{material}</p>
          ) : null}
        </div>
      </Link>
      <div className="mt-auto border-t border-rule/80 px-4 pb-4 pt-3">
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}
