import type { Metadata } from "next";
import Link from "next/link";
import { AMAZON_DISCLOSURE } from "@/lib/affiliate";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms for using ${site.name} guides, printables, and shop.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Terms of Use</h1>
      <div className="prose-guide mt-8">
        <p>
          {site.name} provides free guides and printables for personal use.
          Content is practical advice, not legal, medical, or financial counsel.
          Your household, your call.
        </p>
        <p>
          Shop items are made to order. Colors and placement can vary slightly
          from mockups. See checkout for final price, shipping, and returns
          handled through our payment and fulfillment partners.
        </p>
        <h2 id="affiliate-disclosure">Affiliate disclosure</h2>
        <p>
          Some outbound links on {site.name}, including deals in the Sunday
          Dispatch, are affiliate links. If you buy through one, we may earn a
          small commission at no extra cost to you. It never changes the price
          you pay, and it does not decide what we recommend: we only list things
          we would buy for our own households, at prices we would pay.
        </p>
        <p>
          {AMAZON_DISCLOSURE} Prices and availability on retailer sites are set
          by those retailers and can change after we publish.
        </p>
        <p>
          Do not scrape, resell, or republish our guides as your own product.
          Linking back is always welcome.
        </p>
        <p>
          We may update these terms as the site grows. Continued use means you
          accept the current version.
        </p>
        <p>
          Questions?{" "}
          <Link href="/about" className="text-pine hover:text-rust">
            Contact us
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${site.email}`} className="text-pine hover:text-rust">
            {site.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
