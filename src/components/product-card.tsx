import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import { productPriceRange, type Product } from "@/lib/products";

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
  const featured = variant === "featured";

  return (
    <article
      className={
        featured
          ? "flex h-full flex-col border border-rule bg-paper"
          : "flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-2"
      }
    >
      <Link href={`/shop/${product.slug}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2/50">
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-md border border-rule bg-paper px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {badge}
            </span>
          ) : null}
          <ProductMedia product={product} />
        </div>
        <div className={`space-y-1 ${featured ? "p-5" : "px-4 pt-4"}`}>
          <p className="text-xs text-ink-soft">{product.category}</p>
          <h3 className="font-display text-xl leading-snug transition group-hover:text-rust">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-ink">{priceLabel}</p>
        </div>
      </Link>
      <div className={`mt-auto ${featured ? "border-t border-rule p-5 pt-0" : "px-4 pb-4 pt-3"}`}>
        {featured ? (
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex text-sm font-medium text-pine transition hover:text-rust"
          >
            View product →
          </Link>
        ) : (
          <AddToCartButton product={product} compact hideColorSelect />
        )}
      </div>
    </article>
  );
}
