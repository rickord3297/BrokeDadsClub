"use client";

import Link from "next/link";
import { useState } from "react";
import { ClubLogo } from "@/components/club-logo";
import { useCart } from "@/components/cart-provider";
import { site } from "@/lib/site";

const nav = [
  { href: "/guides", label: "Guides" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <ClubLogo size={64} priority className="shrink-0" />
          <span className="leading-tight">
            <span className="block font-stamp text-[1.35rem] uppercase tracking-[0.12em]">
              Broke Dads Club
            </span>
            <span className="hidden text-xs font-medium tracking-wide text-rust sm:block">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-rust">
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="rounded-full border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper"
          >
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className="rounded-full border border-ink px-3 py-1 text-sm">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
          <button
            type="button"
            className="rounded-full border border-rule px-3 py-1 text-sm"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-rule px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-base">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
