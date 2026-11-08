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
  return pillarMetadata("work", parseGuidePage(params));
}

export default async function WorkGuidesPage({ searchParams }: Props) {
  return <GuidePillarPage slug="work" searchParams={await searchParams} />;
}
