import Link from "next/link";
import { ClubLogo } from "@/components/club-logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { RecapTopics } from "@/components/recap-topics";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-pine text-paper print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <ClubLogo size={64} className="shrink-0 bg-paper" />
            <p className="font-stamp text-2xl uppercase tracking-[0.14em]">
              {site.name}
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-paper/90">
            Guides for the money, the kids, and the long haul, plus merch that
            funds the next article. No shame. No hustle-bro nonsense.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gold">
            {site.tagline}
          </p>
          <p className="mt-3 text-sm">
            <a href={`mailto:${site.email}`} className="text-gold hover:text-paper">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
            Weekly recap
          </p>
          <p className="mt-2 font-display text-xl">
            One email when a new guide goes up.
          </p>
          <p className="mt-2 text-sm leading-6 text-paper/90">
            Quiet weeks stay quiet. Unsubscribe whenever.
          </p>
          <div className="mt-3">
            <RecapTopics className="text-sm leading-6 text-paper/80 [&_a]:hover:text-gold" />
          </div>
          <div className="mt-4">
            <NewsletterForm source="footer" submitLabel="Get the recap" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-paper/85 sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <Link href="/guides" className="hover:text-gold">
              Guides
            </Link>
            <Link href="/resources" className="hover:text-gold">
              Tools
            </Link>
            <Link href="/shop" className="hover:text-gold">
              Shop
            </Link>
            <Link href="/about" className="hover:text-gold">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
