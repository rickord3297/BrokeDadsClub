"use client";

import { useEffect } from "react";
import { trackGuideView } from "@/lib/analytics";

export function GuideViewTracker({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  useEffect(() => {
    trackGuideView(slug, category);
  }, [slug, category]);

  return null;
}
