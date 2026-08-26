import { site } from "@/lib/site";

export function SiteTagline({
  size = "default",
  theme = "light",
  as: Tag = "p",
  className = "",
}: {
  size?: "hero" | "default" | "compact";
  theme?: "light" | "dark";
  as?: "p" | "h1" | "span";
  className?: string;
}) {
  const sizeClass =
    size === "hero"
      ? "text-4xl sm:text-5xl lg:text-6xl"
      : size === "compact"
        ? "text-sm sm:text-base"
        : "text-xl sm:text-2xl";

  const brokeClass = theme === "dark" ? "text-gold" : "text-rust";
  const middleClass = theme === "dark" ? "text-paper/75" : "text-ink-soft";
  const brokenClass = theme === "dark" ? "text-paper" : "text-pine";

  return (
    <Tag
      className={`font-display leading-[1.1] tracking-tight ${sizeClass} ${className}`}
      aria-label={site.tagline}
    >
      <span className={brokeClass}>Broke</span>
      <span className={middleClass}> doesn&apos;t mean </span>
      <span className={brokenClass}>broken.</span>
    </Tag>
  );
}
