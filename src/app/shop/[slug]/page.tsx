import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProductDetail } from "@/components/product-detail";
import { getProduct, getProducts } from "@/lib/products";
import { buildPageMetadata, productJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

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

  return buildPageMetadata({
    title: `${product.name} | ${site.name}`,
    description: product.description,
    path: `/shop/${product.slug}`,
    keywords: [
      product.name.toLowerCase(),
      "broke dads club merch",
      product.category.toLowerCase(),
    ],
    absoluteTitle: true,
    images: product.image ? [product.image] : undefined,
  });
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ProductDetail product={product} />
    </>
  );
}
