"use client";

import { usePathname } from "next/navigation";

/** Paid-traffic landing pages get no site menu or footer, so the only action is the signup form. */
export const LANDING_PATHS = ["/free-grocery-list"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (LANDING_PATHS.includes(pathname)) return null;
  return <>{children}</>;
}
