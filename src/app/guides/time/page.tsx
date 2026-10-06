import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";

export const metadata: Metadata = pillarMetadata("time");

export default function TimeGuidesPage() {
  return <GuidePillarPage slug="time" />;
}
