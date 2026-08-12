import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductMedia } from "@/components/product-media";
import { formatMoney } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-rule bg-paper-2">
        <ProductMedia product={product} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-rust">
          {product.category}
        </p>
        <h1 className="mt-3 font-display text-5xl">{product.name}</h1>
        <p className="mt-4 font-display text-3xl">
          {formatMoney(product.price_cents)}
        </p>
        <p className="mt-6 max-w-lg text-lg leading-8 text-ink-soft">
          {product.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <AddToCartButton product={product} />
          <Link href="/cart" className="text-sm font-medium text-pine hover:text-rust">
            View cart →
          </Link>
        </div>
      </div>
    </div>
  );
}
