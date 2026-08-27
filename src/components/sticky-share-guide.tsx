"use client";

import { useEffect, useState } from "react";
import { ShareGuide } from "@/components/share-guide";

export function StickyShareGuide({
  title,
  url,
  slug,
}: {
  title: string;
  url: string;
  slug: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector("[data-reading-progress]");
      if (!article) return;
      const headerBottom = article.getBoundingClientRect().top + 220;
      setVisible(headerBottom < 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-4 z-40 print:hidden sm:bottom-6 sm:right-6">
      <div className="rounded-full border border-rule bg-paper/95 px-1 py-1 shadow-lg shadow-ink/15 backdrop-blur">
        <ShareGuide title={title} url={url} slug={slug} />
      </div>
    </div>
  );
}
