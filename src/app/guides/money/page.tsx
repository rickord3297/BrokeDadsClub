import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";

export const metadata: Metadata = pillarMetadata("money");

export default function MoneyGuidesPage() {
  return <GuidePillarPage slug="money" />;
}
