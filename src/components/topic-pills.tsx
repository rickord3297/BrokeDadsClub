"use client";

import Link from "next/link";
import { trackTopicFilter } from "@/lib/analytics";

function guidesHref(topic: string, query = "") {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (query.trim()) params.set("q", query.trim());
  const search = params.toString();
  return search ? `/guides?${search}` : "/guides";
}

export function TopicPills({
  categories,
  active = "",
  query = "",
  size = "default",
  placement = "homepage",
  variant = "pills",
}: {
  categories: string[];
  active?: string;
  query?: string;
  size?: "default" | "lg";
  placement?: string;
  variant?: "pills" | "tabs";
}) {
  if (!categories.length) return null;

  const pills = ["", ...categories];
  const pillClass =
    size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-sm";

  if (variant === "tabs") {
    return (
      <div
        className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-rule bg-paper p-1"
        role="navigation"
        aria-label="Guide topics"
      >
        {pills.map((topic) => {
          const selected = topic === active;
          return (
            <Link
              key={topic || "all"}
              href={guidesHref(topic, query)}
              scroll={false}
              onClick={() => trackTopicFilter(topic, placement)}
              className={
                selected
                  ? `rounded-md bg-pine font-medium text-paper ${pillClass}`
                  : `rounded-md font-medium text-ink-soft transition hover:bg-paper-2 hover:text-ink ${pillClass}`
              }
            >
              {topic || "All"}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3" role="navigation" aria-label="Guide topics">
      {pills.map((topic) => {
        const selected = topic === active;
        return (
          <Link
            key={topic || "all"}
            href={guidesHref(topic, query)}
            scroll={false}
            onClick={() => trackTopicFilter(topic, placement)}
            className={
              selected
                ? `rounded-full bg-pine font-semibold text-paper ${pillClass}`
                : `rounded-full border border-rule bg-paper font-medium text-ink hover:border-pine hover:text-pine ${pillClass}`
            }
          >
            {topic || "All"}
          </Link>
        );
      })}
    </div>
  );
}
