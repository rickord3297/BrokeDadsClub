import { site } from "@/lib/site";

export function SiteTagline({
  size = "default",
  theme = "light",
  className = "",
}: {
  size?: "hero" | "default" | "compact";
  theme?: "light" | "dark";
  className?: string;
}) {
  const sizeClass =
    size === "hero"
      ? "text-[1.75rem] sm:text-[2.35rem]"
      : size === "compact"
        ? "text-sm sm:text-base"
        : "text-xl sm:text-2xl";

  const brokeClass = theme === "dark" ? "text-gold" : "text-rust";
  const middleClass = theme === "dark" ? "text-paper/75" : "text-ink-soft";
  const brokenClass = theme === "dark" ? "text-paper" : "text-pine";

  return (
    <p
      className={`font-display leading-tight tracking-tight ${sizeClass} ${className}`}
      aria-label={site.tagline}
    >
      <span className={brokeClass}>Broke</span>
      <span className={middleClass}> doesn&apos;t mean </span>
      <span className={brokenClass}>broken.</span>
    </p>
  );
}
