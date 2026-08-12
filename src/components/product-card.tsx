import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-rule bg-paper-2"
    >
      <div className="aspect-square overflow-hidden">
        <ProductArt art={product.art} />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
          {product.category}
        </p>
        <h3 className="font-display text-xl group-hover:text-rust">
          {product.name}
        </h3>
        <p className="text-sm font-medium">{formatMoney(product.price_cents)}</p>
      </div>
    </Link>
  );
}
