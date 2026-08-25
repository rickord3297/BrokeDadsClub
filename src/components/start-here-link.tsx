"use client";

import Link from "next/link";
import { trackStartHereClick } from "@/lib/analytics";

export function StartHereLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackStartHereClick(href)}
    >
      {children}
    </Link>
  );
}
