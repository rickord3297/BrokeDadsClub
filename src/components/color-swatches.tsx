"use client";

import { colorSwatchHex } from "@/lib/product-display";

export function ColorSwatches({
  colors,
  selected,
  onSelect,
  max = 8,
  size = "md",
}: {
  colors: string[];
  selected?: string;
  onSelect?: (color: string) => void;
  max?: number;
  size?: "sm" | "md";
}) {
  if (!colors.length) return null;

  const visible = colors.slice(0, max);
  const extra = colors.length - visible.length;
  const dim = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Available colors">
      {visible.map((color) => {
        const hex = colorSwatchHex(color);
        const isLight = isLightHex(hex);
        const active = selected === color;
        const interactive = Boolean(onSelect);
        const className = `${dim} rounded-full border transition ${
          active
            ? "border-ink ring-2 ring-ink/25 ring-offset-1 ring-offset-paper"
            : isLight
              ? "border-ink/25"
              : "border-transparent"
        } ${interactive ? "cursor-pointer hover:scale-105" : ""}`;

        if (interactive) {
          return (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={color}
              aria-pressed={active}
              onClick={() => onSelect?.(color)}
              className={className}
              style={{ backgroundColor: hex }}
            />
          );
        }

        return (
          <span
            key={color}
            title={color}
            aria-label={color}
            className={className}
            style={{ backgroundColor: hex }}
          />
        );
      })}
      {extra > 0 ? (
        <span className="text-[11px] font-medium text-ink-soft">+{extra}</span>
      ) : null}
    </div>
  );
}

function isLightHex(hex: string) {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return false;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}
