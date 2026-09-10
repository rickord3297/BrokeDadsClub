import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "About Broke Dads Club",
  description:
    "Broke Dads Club is for dads stretching every dollar: direct guides, fridge-door printables, and optional club gear. No hustle talk. No shame.",
  path: "/about",
  keywords: ["about broke dads club", "dad budget community", "family finance for dads"],
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">About</p>
      <h1 className="mt-3 font-display text-5xl">
        You&apos;re not the only one doing the math.
      </h1>
      <p className="mt-4 font-display text-2xl text-pine">{site.tagline}</p>
      <Image
        src="/brand/club-logo.png"
        alt="Broke Dads Club crest"
        width={240}
        height={240}
        className="mx-auto my-8"
      />
      <div className="prose-guide mt-8">
        <p>
          Most family finance advice assumes you have thousands in disposable
          income to park into index funds or hours to micromanage coupon apps.
          Real life does not work like that.
        </p>
        <p>
          {site.name} is built for the dad sitting at the kitchen table after
          bedtime, staring at a spreadsheet, trying to bridge the gap between
          paychecks, rising grocery bills, and unexpected repairs. You love
          your kids more than your bank account currently reflects. That is not
          a character flaw. It is a season, and you are running a household
          with tight margins and zero room for error.
        </p>

        <h2>What you&apos;ll find here</h2>
        <p>We skip the theory and give you an operating system for everyday family life:</p>
        <ul>
          <li>
            <strong>Direct guides:</strong> Tactical breakdowns on groceries,
            family money conversations, cheap dates, and flexible work. Start
            with the <Link href="/guides">guides</Link>.
          </li>
          <li>
            <strong>Fridge-door printables:</strong> Simple checklists and cash
            flow templates you can print, stick on the fridge, and use
            immediately. Grab the free{" "}
            <Link href="/resources">printables</Link>.
          </li>
          <li>
            <strong>The shop:</strong> Everyday gear and club apparel. Buying a
            hoodie helps keep the guides and templates free; skipping it because
            groceries won this week is also 100% club behavior. Browse the{" "}
            <Link href="/shop">shop</Link> when the budget allows.
          </li>
        </ul>

        <h2>Who this is for</h2>
        <ul>
          <li>
            The dad who works hard but watches pay increases get absorbed by
            inflation.
          </li>
          <li>
            The dad who needs a clear, straightforward routine to manage cash
            flow without spending twenty hours building formulas.
          </li>
          <li>
            The dad who wants practical systems, clear boundaries, and zero
            financial shame.
          </li>
        </ul>

        <h2>What we are not</h2>
        <p>
          We are not a hustle seminar. We are not a shame machine. We will never
          tell you to wake up at 4 a.m. and ice-bath your way to a luxury car.
        </p>

        <h2>Membership</h2>
        <p>
          There is no velvet rope. Read what is useful, grab the free
          printables, and join the Sunday email for a steady start to your week.
          The dues are optional, no judgment attached, and the door is open.
        </p>
      </div>

      <aside className="mt-12 border-t border-rule pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
          Contact us
        </p>
        <h2 className="mt-2 font-display text-3xl">Questions, ideas, or a typo?</h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          We read every note. Guides, printables, shop, or just a dad story that
          belongs on the site, send it below.
        </p>
        <ContactForm />
      </aside>
    </div>
  );
}
