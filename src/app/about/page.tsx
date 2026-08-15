import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "What Broke Dads Club is, who it's for, and why the shop exists.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">About</p>
      <h1 className="mt-3 font-display text-5xl">You&apos;re not the only one doing the math.</h1>
      <Image
        src="/brand/club-logo.png"
        alt="Broke Dads Club crest"
        width={240}
        height={240}
        className="mx-auto my-8"
      />
      <div className="prose-guide mt-8">
        <p>
          {site.name} is for dads who love their kids more than their bank
          account currently reflects. That is not a character flaw. It is a
          season (sometimes a long one), and it goes better with tactics and
          company.
        </p>
        <p>
          The site does two jobs. The <Link href="/guides">guides</Link> are the
          reason to show up: groceries, money talks, cheap dates, work that
          fits around bedtime. The <Link href="/resources">free printables</Link>{" "}
          are the fridge-door versions. The <Link href="/shop">shop</Link> is how we
          keep those guides free and the lights on. The crest (castle, crowns,
          and a drawbridge) is the joke and the membership card: family magic
          costs a fortune, and we are still in the club.
        </p>
        <h2>What we are not</h2>
        <p>
          We are not a hustle seminar. We are not a shame machine. We are not
          going to tell you to wake up at 4 a.m. and ice-bath your way to a
          Tesla. Buy the hoodie if you want the hoodie. Skip it if the
          grocery list wins this week. Both are club behavior.
        </p>
        <h2>Membership</h2>
        <p>
          There is no velvet rope. Read what&apos;s useful, share it with
          another dad who is quietly doing the same arithmetic, and grab the
          Sunday email if you want a start to the week in your inbox. If you want a
          card in your wallet later, we&apos;ll build that. Right now the
          dues are optional and the door is open.
        </p>
      </div>
    </div>
  );
}
