import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles email signups and basic site data.`,
};

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
