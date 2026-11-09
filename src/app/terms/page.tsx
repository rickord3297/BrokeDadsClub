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
          {site.name} is operated by {site.legal.companyName}, an{" "}
          {site.legal.jurisdiction} limited liability company. We provide
          practical guides, newsletters, and printable tools for everyday
          household organization and parenting. All content is shared for
          informational and educational purposes only, not legal, medical, or
          financial counsel. Your household, your call.
        </p>

        <h2>Digital Products &amp; Downloads</h2>
        <p>
          Free and paid digital downloads (guides, planners, checklists) are
          licensed for personal, single-household use only. You may not scrape,
          resell, bundle, redistribute, or republish our materials as your own
          product. Linking back or citing us with credit is always welcome.
        </p>

        <h2>Physical Merchandise &amp; Orders</h2>
        <p>
          Shop merchandise is made to order. Colors, print scale, and garment
          placement may vary slightly from digital mockups. Payment processing,
          taxes, shipping timelines, order tracking, and returns are handled
          directly through our third-party fulfillment and payment partners at
          checkout.
        </p>

        <h2 id="affiliate-disclosure">Affiliate &amp; Advertising Disclosure</h2>
        <p>
          Certain outbound links across {site.name} and within our email
          dispatches are affiliate links. If you make a purchase through these
          links, we may earn a commission at no additional cost to you. We only
          recommend gear, tools, and services we actively use, trust, or would
          purchase for our own families.
        </p>
        <p>
          {AMAZON_DISCLOSURE} Retail pricing and inventory availability are
          controlled entirely by the third-party merchant and may fluctuate
          after publication.
        </p>

        <h2>Updates &amp; Contact</h2>
        <p>
          We reserve the right to revise these terms as site features evolve.
          Your continued use of the site signifies acceptance of the active
          version.
        </p>
        <p>
          Questions? Reach out via our{" "}
          <Link href="/about" className="text-pine hover:text-rust">
            Contact us
          </Link>{" "}
          page.
        </p>
        <p>
          Formal legal notices for {site.legal.companyName} may be sent to{" "}
          {site.legal.registeredAgent.name}, {site.legal.registeredAgent.street},{" "}
          {site.legal.registeredAgent.suite}, {site.legal.registeredAgent.city},{" "}
          {site.legal.registeredAgent.region}{" "}
          {site.legal.registeredAgent.postalCode},{" "}
          {site.legal.registeredAgent.country}. Customer support and general
          questions should use the Contact us form, not this address.
        </p>
      </div>
    </div>
  );
}
