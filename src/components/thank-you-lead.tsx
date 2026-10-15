"use client";

import { useEffect } from "react";

/**
 * Fires the Meta Lead event for signups that redirected here. Requires `from`, so a bookmarked or
 * shared /thank-you never counts, and the sessionStorage key stops a refresh from counting twice.
 */
export function ThankYouLead({ from }: { from?: string }) {
  useEffect(() => {
    if (!from || typeof window === "undefined" || !window.fbq) return;
    const key = `bdc_lead_${from}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Private mode can block storage; counting the lead beats losing it.
    }
    window.fbq("track", "Lead", { content_name: from });
  }, [from]);

  return null;
}
