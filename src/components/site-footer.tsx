import Link from "next/link";
import { ClubLogo } from "@/components/club-logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-pine text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <ClubLogo size={64} className="shrink-0 bg-paper" />
            <p className="font-stamp text-2xl uppercase tracking-[0.14em]">
              {site.name}
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-paper/80">
            Guides for the money, the kids, and the long haul, plus merch that
            funds the next article. No shame. No hustle-bro nonsense.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold">
            {site.tagline}
          </p>
        </div>

        <div>
          <p className="font-display text-xl">Get the Sunday dispatch</p>
          <p className="mt-2 text-sm text-paper/75">
            One email a week. A tactic you can use Monday. Unsubscribe whenever.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-paper/60 sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/guides">Guides</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
