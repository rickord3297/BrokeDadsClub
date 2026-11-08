import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";

export const metadata: Metadata = pillarMetadata("gear");

export default function GearGuidesPage() {
  return <GuidePillarPage slug="gear" />;
}
