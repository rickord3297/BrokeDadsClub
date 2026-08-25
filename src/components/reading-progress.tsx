"use client";

import { useEffect, useRef, useState } from "react";
import { trackReadingMilestone } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100] as const;

export function ReadingProgress({
  slug,
}: {
  slug?: string;
}) {
  const [progress, setProgress] = useState(0);
  const reached = useRef(new Set<number>());

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector("[data-reading-progress]");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(100);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const next = Math.round((scrolled / total) * 100);
      setProgress(next);

      if (!slug) return;
      for (const milestone of MILESTONES) {
        if (next >= milestone && !reached.current.has(milestone)) {
          reached.current.add(milestone);
          trackReadingMilestone(slug, milestone);
        }
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-rule/40 print:hidden"
      aria-hidden
    >
      <div
        className="h-full bg-pine transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
