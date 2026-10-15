import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteTagline } from "@/components/site-tagline";
import preview from "../../public/lead-magnets/grocery-reset-trunk-kit-preview.jpg";

const TRUST_LINE =
  "The PDF lands in your inbox in about a minute. Then one email every Sunday at 9 a.m. CT. Unsubscribe anytime.";

export function HomeHero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-16 lg:pb-14">
        <div>
          <SiteTagline as="h1" size="hero" />
          <p className="mt-6 font-display text-2xl leading-snug text-ink sm:text-3xl">
            The Dad Operating System
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            Start with the free grocery list:{" "}
            <strong className="font-semibold text-ink">
              7 family dinners for $44 at Walmart
            </strong>
            , every item covering two nights. Plus one tactical email every Sunday.
          </p>

          <div id="signup" className="mt-8 w-full max-w-md scroll-mt-24">
            <NewsletterForm
              variant="inline"
              source="homepage_hero"
              submitLabel="Get the free list"
              redirectTo="/thank-you"
              trustLine={TRUST_LINE}
            />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Just browsing?{" "}
            <Link
              href="#start-here"
              className="font-medium text-pine underline decoration-pine/30 underline-offset-4 hover:text-rust"
            >
              Read the guides
            </Link>
          </p>
        </div>

        <figure className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <Image
            src={preview}
            alt="The free one-page grocery list PDF: a 14-item Walmart cart, the week's seven dinners, swaps, and a trunk snack kit."
            priority
            sizes="(min-width: 1024px) 24rem, 80vw"
            className="w-full rotate-1 rounded-lg border border-rule shadow-[0_18px_40px_-18px_rgba(28,25,21,0.45)]"
          />
          <figcaption className="mt-4 text-center text-sm text-ink-soft">
            What lands in your inbox. Total: <span className="font-semibold text-pine">$44.04</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
