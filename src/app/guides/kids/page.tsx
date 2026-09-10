import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";

export const metadata: Metadata = pillarMetadata("kids");

export default function KidsGuidesPage() {
  return <GuidePillarPage slug="kids" />;
}
