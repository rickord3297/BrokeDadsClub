import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { authorPageJsonLd, siteAuthor } from "@/lib/author";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${siteAuthor.name} | Author at Broke Dads Club`,
  description: siteAuthor.shortBio,
  path: siteAuthor.path,
  keywords: [
    "Cord Elmore",
    "broke dads club author",
    "dad budget writer",
    "Chicago dad budget guides",
  ],
});

export default function AuthorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd data={authorPageJsonLd()} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Author</p>
      <h1 className="mt-3 font-display text-5xl">Hi, I&apos;m Cord.</h1>

      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
        <Image
          src={siteAuthor.photoSrc}
          alt={siteAuthor.photoAlt}
          width={160}
          height={160}
          className="shrink-0 rounded-2xl border border-rule bg-paper-2 object-cover"
        />
        <div className="space-y-4 text-base leading-7 text-ink">
          <p>
            I&apos;m a dad of two, ages 4 and 6, married, living in the Chicago
            area, and working a corporate desk job. My weeks look like a lot of
            yours: a paycheck that has to cover everything, a school flyer asking
            for something every few days, and a 7:30 bedtime that doesn&apos;t
            care how the meeting went.
          </p>
        </div>
      </div>

      <div className="prose-guide mt-10">
        <h2>Why Broke Dads Club exists</h2>
        <p>
          Most money advice is written for someone with more time, more money, or
          fewer kids than you. I wanted a place that answers the actual question
          in front of a dad this week, like how much the Thanksgiving basket
          really costs, what a first soccer season needs, or who covers the week
          school closes and work doesn&apos;t. Every guide gets straight to the
          number, and nobody gets shamed for being tight.
        </p>

        <h2>How I write the guides</h2>
        <ul>
          <li>
            I check real prices from stores and sources you can verify, and I
            date every guide.
          </li>
          <li>I give a number and a plan, not a lecture.</li>
          <li>
            I update the seasonal guides each year instead of letting them go
            stale.
          </li>
        </ul>

        <h2>What I&apos;m not</h2>
        <p>
          I&apos;m not a financial advisor, accountant, or lawyer. I write about
          everyday family spending: groceries, school costs, activities,
          holidays, and time. I don&apos;t give investing, tax, or legal advice.
          For those, talk to a licensed pro.
        </p>

        <h2>About the name</h2>
        <p>
          Cord Elmore is a pen name. I use it to keep my kids&apos; lives
          private. Everything else here is real.
        </p>
      </div>

      <p className="mt-10 text-sm text-ink-soft">
        <Link href="/about" className="font-medium text-pine hover:text-rust">
          About the club
        </Link>
        <span className="mx-2 text-rule">·</span>
        <Link href="/guides" className="font-medium text-pine hover:text-rust">
          All guides
        </Link>
      </p>
    </div>
  );
}
