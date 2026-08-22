"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

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
      setProgress(Math.round((scrolled / total) * 100));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
