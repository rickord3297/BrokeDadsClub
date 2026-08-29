import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms for using ${site.name} guides, printables, and shop.`,
};

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
