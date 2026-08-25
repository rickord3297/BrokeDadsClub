import Link from "next/link";
import { ClubLogo } from "@/components/club-logo";
import { SiteTagline } from "@/components/site-tagline";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule bg-pine text-paper print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <ClubLogo size={56} className="shrink-0 bg-paper" />
              <p className="font-stamp text-xl uppercase tracking-[0.14em]">
                {site.name}
              </p>
            </div>
            <SiteTagline size="default" theme="dark" className="mt-5" />
            <p className="mt-4 text-sm leading-6 text-paper/85">
              Guides for the money, the kids, and the long haul. No shame. No
              hustle-bro nonsense.
            </p>
            <p className="mt-3 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="text-gold transition hover:text-paper"
              >
                {site.email}
              </a>
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-paper/90">
            <Link href="/guides" className="transition hover:text-gold">
              Guides
            </Link>
            <Link href="/resources" className="transition hover:text-gold">
              Printables
            </Link>
            <Link href="/shop" className="transition hover:text-gold">
              Shop
            </Link>
            <Link href="/about" className="transition hover:text-gold">
              About
            </Link>
            <Link href="/cart" className="transition hover:text-gold">
              Cart
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-paper/70 sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
