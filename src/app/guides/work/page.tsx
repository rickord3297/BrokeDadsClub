import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";

export const metadata: Metadata = pillarMetadata("work");

export default function WorkGuidesPage() {
  return <GuidePillarPage slug="work" />;
}
