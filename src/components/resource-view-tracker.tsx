"use client";

import { useEffect } from "react";
import { trackPrintableView } from "@/lib/analytics";

export function ResourceViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackPrintableView(slug);
  }, [slug]);

  return null;
}
