"use client";

import { useEffect, useRef } from "react";
import { trackMetaPurchase } from "@/lib/meta-pixel";

export function PurchaseTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;

    tracked.current = true;

    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { value?: number; currency?: string } | null) => {
        if (!data?.value) return;
        trackMetaPurchase({
          value: data.value,
          currency: data.currency ?? "USD",
        });
      })
      .catch(() => {
        tracked.current = false;
      });
  }, []);

  return null;
}
