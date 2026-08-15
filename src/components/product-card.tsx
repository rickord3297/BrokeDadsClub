import Link from "next/link";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import { productPriceRange, type Product } from "@/lib/products";

export function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  const range = productPriceRange(product);
  const priceLabel =
    range.max > range.min
      ? `From ${formatMoney(range.min)}`
      : formatMoney(product.price_cents);
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-rule bg-paper-2"
    >
      <div className="relative aspect-square overflow-hidden bg-paper">
        {badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-pine px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
            {badge}
          </span>
        ) : null}
        <ProductMedia product={product} />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rust">
          {product.category}
        </p>
        <h3 className="font-display text-xl group-hover:text-rust">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-ink">{priceLabel}</p>
      </div>
    </Link>
  );
}
