import type { ComponentType } from "react";
import { CanWeAffordItSheet } from "@/components/resource-sheets/can-we-afford-it-sheet";
import { MorningLaunchpadSheet } from "@/components/resource-sheets/morning-launchpad-sheet";
import { RainyDayPlayMatrixSheet } from "@/components/resource-sheets/rainy-day-play-matrix-sheet";
import { SitterHandoffSheet } from "@/components/resource-sheets/sitter-handoff-sheet";
import { SubscriptionBurnSheet } from "@/components/resource-sheets/subscription-burn-sheet";
import { YouthSportsTrueCostSheet } from "@/components/resource-sheets/youth-sports-true-cost-sheet";

const LEGACY_RESOURCE_PAGES = new Set([
  "grocery-week-checklist",
  "school-supply-triage",
  "birthday-party-budget",
]);

const sheets: Record<string, ComponentType> = {
  "sitter-handoff-card": SitterHandoffSheet,
  "morning-launchpad-checklist": MorningLaunchpadSheet,
  "rainy-day-play-matrix": RainyDayPlayMatrixSheet,
  "subscription-burn-sheet": SubscriptionBurnSheet,
  "youth-sports-true-cost": YouthSportsTrueCostSheet,
  "can-we-afford-it-flowchart": CanWeAffordItSheet,
};

export function getResourceSheet(slug: string): ComponentType | null {
  if (LEGACY_RESOURCE_PAGES.has(slug)) return null;
  return sheets[slug] ?? null;
}

export function dynamicResourceSlugs(): string[] {
  return Object.keys(sheets);
}
