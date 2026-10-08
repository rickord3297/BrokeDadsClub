import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadMagnetLanding } from "@/components/lead-magnet-landing";
import {
  getLeadMagnet,
  leadMagnetResource,
  leadMagnets,
} from "@/lib/lead-magnets";
import { NOINDEX, buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return leadMagnets.map((magnet) => ({ slug: magnet.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/free/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) return { title: "Free printable not found", ...NOINDEX };
  return buildPageMetadata({
    title: magnet.seoTitle,
    description: magnet.description,
    path: `/free/${magnet.slug}`,
    keywords: [
      magnet.promise,
      "free printable for dads",
      "dad grocery template",
      "family budget printable",
    ],
  });
}

export default async function FreeLeadMagnetPage({
  params,
}: PageProps<"/free/[slug]">) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();
  const resource = leadMagnetResource(magnet);

  return <LeadMagnetLanding magnet={magnet} resource={resource} />;
}
