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

function normalizeCategories(categories: string[]) {
  return [
    ...new Set(
      categories.filter(
        (category) => Boolean(category?.trim()) && category.trim() !== "All",
      ),
    ),
  ];
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
  const topics = normalizeCategories(categories);
  if (!topics.length) return null;

  const pills: { value: string; label: string }[] = [
    { value: "", label: "All" },
    ...topics.map((topic) => ({ value: topic, label: topic })),
  ];
  const pillClass =
    size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-sm";

  if (variant === "tabs") {
    return (
      <div
        className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-rule bg-paper p-1"
        role="navigation"
        aria-label="Guide topics"
      >
        {pills.map(({ value, label }) => {
          const selected = value === active;
          return (
            <Link
              key={value || "all-topics"}
              href={guidesHref(value, query)}
              scroll={false}
              onClick={() => trackTopicFilter(value, placement)}
              className={
                selected
                  ? `rounded-md bg-pine font-medium text-paper ${pillClass}`
                  : `rounded-md font-medium text-ink-soft transition hover:bg-paper-2 hover:text-ink ${pillClass}`
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3" role="navigation" aria-label="Guide topics">
      {pills.map(({ value, label }) => {
        const selected = value === active;
        return (
          <Link
            key={value || "all-topics"}
            href={guidesHref(value, query)}
            scroll={false}
            onClick={() => trackTopicFilter(value, placement)}
            className={
              selected
                ? `rounded-full bg-pine font-semibold text-paper ${pillClass}`
                : `rounded-full border border-rule bg-paper font-medium text-ink hover:border-pine hover:text-pine ${pillClass}`
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
