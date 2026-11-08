import type { Metadata } from "next";
import {
  GuidePillarPage,
  pillarMetadata,
} from "@/components/guide-pillar-page";
import { parseGuidePage } from "@/lib/guide-pagination";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return pillarMetadata("money", parseGuidePage(params));
}

export default async function MoneyGuidesPage({ searchParams }: Props) {
  return <GuidePillarPage slug="money" searchParams={await searchParams} />;
}
