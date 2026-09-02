import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop-explorer";
import { ShopFaq } from "@/components/shop-faq";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Dad Merch and Club Apparel",
  description:
    "Broke Dads Club tees, hoodies, totes, and pins. Garment-dyed club wear that helps fund free guides and printables.",
  path: "/shop",
  keywords: [
    "dad merch",
    "dad apparel",
    "broke dads club shirt",
    "dad hoodie",
    "family budget club wear",
  ],
});

export default async function ShopPage() {
  const products = await getProducts();
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Broke Dads Club shop",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/shop/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={itemListLd} />
      <h1 className="font-display text-5xl">The Shop</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Soft tees for tough weeks. Grab a shirt, support other dads, or skip it
        if the grocery budget comes first.
      </p>
      {site.social.find((item) => item.label === "Etsy") ? (
        <p className="mt-3 text-sm text-ink-soft">
          Prefer Etsy checkout?{" "}
          <a
            href={site.social.find((item) => item.label === "Etsy")!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-pine transition hover:text-rust"
          >
            Shop on Etsy
          </a>
        </p>
      ) : null}
      <ShopExplorer products={products} />
      <ShopFaq />
    </div>
  );
}