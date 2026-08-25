"use client";

import Link from "next/link";
import { useState } from "react";
import { ClubLogo } from "@/components/club-logo";
import { SiteTagline } from "@/components/site-tagline";
import { useCart } from "@/components/cart-provider";

const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/resources", label: "Printables" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/90 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <ClubLogo size={52} priority className="shrink-0" />
          <span className="leading-tight">
            <span className="block font-stamp text-xl uppercase tracking-[0.12em] sm:text-[1.35rem]">
              Broke Dads Club
            </span>
            <SiteTagline size="compact" className="mt-1 hidden sm:block" />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="transition hover:text-ink"
          >
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm text-ink-soft md:hidden">
          <Link href="/cart" className="transition hover:text-ink">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
          <button
            type="button"
            className="transition hover:text-ink"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-rule px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-base text-ink-soft">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
