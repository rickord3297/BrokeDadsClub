import Image from "next/image";
import Link from "next/link";
import { ColorSwatches } from "@/components/color-swatches";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import { productHoverImage, productMaterialNote } from "@/lib/product-display";
import { productColors, productPriceRange, type Product } from "@/lib/products";

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

  const rangeLabel =
    range.max > range.min
      ? `${formatMoney(range.min)}-${formatMoney(range.max)}`
      : formatMoney(range.min);
  const colors = productColors(product);
  const hoverImage =
    product.image_fit === "contain" ? undefined : productHoverImage(product);

  return (
    <Link
      href={`/shop/${product.slug}`}
      aria-label={`${product.name}, ${rangeLabel}. View details`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${hoverClass}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        {badge ? (
          <span className="absolute left-2 top-2 z-20 rounded-full bg-pine px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper sm:left-3 sm:top-3 sm:px-2.5 sm:py-1">
            {badge}
          </span>
        ) : null}
        <ProductMedia product={product} />
        {hoverImage ? (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 33vw, 50vw"
            className="z-10 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rust sm:text-xs">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-base leading-snug transition group-hover:text-rust sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-ink">{rangeLabel}</p>
        <div className="mt-2 min-h-5">
          <ColorSwatches colors={colors} max={4} size="sm" />
        </div>
        <span className="mt-auto pt-3 text-xs font-semibold text-pine transition group-hover:text-rust sm:text-sm">
          View details →
        </span>
      </div>
    </Link>
  );
}
