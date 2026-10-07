import type { Metadata } from "next";
import Link from "next/link";
import { AMAZON_DISCLOSURE } from "@/lib/affiliate";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles email signups, orders, and basic site data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Privacy Policy</h1>
      <div className="prose-guide mt-8">
        <p>
          {site.name} keeps things simple. We collect your email when you sign
          up for the Sunday list or complete checkout. We use it to send guides,
          printables, and order updates. We do not sell your email.
        </p>
        <p>
          Shop orders are processed through Stripe and fulfilled through our
          print partner. Payment details stay with those providers, not in our
          inbox.
        </p>
        <p>
          We may connect a Pinterest business account to publish pins that link
          back to our guides and printables. That connection uses Pinterest&apos;s
          OAuth tokens stored for our own publishing tools. We do not post on
          your personal Pinterest account or sell Pinterest data.
        </p>
        <h2 id="affiliate-links">Affiliate links</h2>
        <p>
          Some outbound links on {site.name} and in the Sunday email are
          affiliate links. If you buy through one, we may earn a commission at
          no extra cost to you. {AMAZON_DISCLOSURE}
        </p>
        <p>
          When you click an affiliate link, the retailer (for example, Amazon)
          may set cookies or use similar technology on its own site to credit
          the referral. Those retailers handle that data under their own privacy
          policies. We do not receive your name, payment details, or what else
          you buy, only aggregate reports of qualifying sales.
        </p>
        <p>
          Every Sunday email includes an unsubscribe link. You can also email{" "}
          <a href={`mailto:${site.email}`} className="text-pine hover:text-rust">
            {site.email}
          </a>{" "}
          to opt out.
        </p>
        <p>
          Questions? See the{" "}
          <Link href="/about" className="text-pine hover:text-rust">
            About
          </Link>{" "}
          page or contact us directly.
        </p>
      </div>
    </div>
  );
}
