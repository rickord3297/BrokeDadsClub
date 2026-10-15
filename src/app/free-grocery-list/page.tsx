import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClubLogo } from "@/components/club-logo";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { GROCERY_LIST_OG_IMAGE, NOINDEX } from "@/lib/seo";
import { site } from "@/lib/site";
import preview from "../../../public/lead-magnets/grocery-reset-trunk-kit-preview.jpg";

export const metadata: Metadata = {
  title: "Free grocery list: 7 family dinners for $44",
  description:
    "A free one-page Walmart grocery list where every item covers two dinners. Seven family dinners came to $44.04.",
  openGraph: {
    title: "Free grocery list: 7 family dinners for $44",
    description: "A free one-page Walmart grocery list where every item covers two dinners.",
    url: `${site.url}/free-grocery-list`,
    siteName: site.name,
    type: "website",
    images: [GROCERY_LIST_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free grocery list: 7 family dinners for $44",
    description: "A free one-page Walmart grocery list where every item covers two dinners.",
    images: [GROCERY_LIST_OG_IMAGE.url],
  },
  ...NOINDEX,
};

const magnet = LEAD_MAGNETS["grocery-reset-trunk-kit"];
const SOURCE = "free_grocery_list_landing";

const WEEK = [
  { day: "Mon", dinner: "Baked chicken thighs" },
  { day: "Tue", dinner: "Chicken quesadillas", from: "Monday's chicken" },
  { day: "Wed", dinner: "Spaghetti with beef" },
  { day: "Thu", dinner: "Taco bowls", from: "Wednesday's beef" },
  { day: "Fri", dinner: "Breakfast for dinner" },
  { day: "Sat", dinner: "Baked potato bar" },
  { day: "Sun", dinner: "Fried rice", from: "the leftover rice and eggs" },
] as const;

const INSIDE = [
  "The whole cart on one page, 14 items, store-brand Walmart prices",
  "Which two dinners each item covers, so nothing is bought for one night",
  "A swap for every main item when the price jumps",
  "A trunk snack kit for the 5:40 p.m. drive-thru moment",
] as const;

export default function FreeGroceryListPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <ClubLogo size={40} priority />
          <span className="leading-tight">
            <span className="block font-stamp text-lg uppercase tracking-[0.12em] text-ink">
              {site.name}
            </span>
            <span className="block font-display text-xs text-rust">{site.tagline}</span>
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 pt-8 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Free printable PDF
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            7 family dinners for $44.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-ink-soft">
            A real Walmart list where every item covers two nights. One pack of chicken
            is Monday&apos;s dinner and Tuesday&apos;s quesadillas.
          </p>

          <div id="get-list" className="mt-7 max-w-md scroll-mt-6">
            <LeadMagnetForm
              slug={magnet.slug}
              fileName={magnet.fileName}
              source={SOURCE}
              storeSource
              redirectTo="/thank-you"
              submitLabel="Send me the list"
            />
          </div>

          <ul className="mt-8 space-y-3">
            {INSIDE.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-pine" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <Image
            src={preview}
            alt="The one-page grocery list PDF: a 14-item Walmart cart, the week's seven dinners, swaps, and a trunk snack kit."
            priority
            sizes="(min-width: 1024px) 26rem, 90vw"
            className="w-full rotate-1 rounded-lg border border-rule shadow-[0_18px_40px_-18px_rgba(28,25,21,0.45)]"
          />
        </div>
      </section>

      <section className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">The week</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Nothing gets bought for one night.</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WEEK.map((night) => (
              <li key={night.day} className="rounded-lg border border-rule bg-paper px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pine">{night.day}</p>
                <p className="mt-1 text-sm font-medium text-ink">{night.dinner}</p>
                {"from" in night ? (
                  <p className="mt-0.5 text-xs text-ink-soft">Uses {night.from}</p>
                ) : null}
              </li>
            ))}
            <li className="flex flex-col justify-center rounded-lg bg-pine px-4 py-3 text-paper">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Total</p>
              <p className="mt-1 font-display text-2xl">$44.04</p>
              <p className="text-xs text-paper/75">about $1.47 a plate</p>
            </li>
          </ol>
          <p className="mt-5 text-xs leading-5 text-ink-soft">
            Dinners for 3 to 4 people. Store-brand prices checked at Walmart in October 2026.
            Your store will be a little different. Breakfast and lunch are not included.
          </p>
          <a
            href="#get-list"
            className="mt-7 inline-flex h-12 items-center rounded-md bg-pine px-6 text-sm font-semibold text-paper transition hover:bg-pine-2"
          >
            Send me the free list
          </a>
        </div>
      </section>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-ink-soft sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. One email on Sundays. Unsubscribe anytime.
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-pine">Privacy</Link>
            <Link href="/terms" className="hover:text-pine">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
