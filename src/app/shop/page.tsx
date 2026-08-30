import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop-explorer";
import { ShopFaq } from "@/components/shop-faq";
import { site } from "@/lib/site";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Broke Dads Club merch: tees, hats, and pins. Ships in 3-5 business days.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
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
