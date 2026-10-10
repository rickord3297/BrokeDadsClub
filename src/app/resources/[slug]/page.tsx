import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintableSheet } from "@/components/printable-sheet";
import { ResourceLayout } from "@/components/resource-layout";
import { getLivePrintable, getLivePrintables } from "@/lib/printables";
import { NOINDEX, resourcePageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getLivePrintables().map((printable) => ({ slug: printable.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const printable = getLivePrintable(slug);
  if (!printable) return { title: "Printable not found", ...NOINDEX };
  return resourcePageMetadata(printable);
}

export default async function PrintablePage({
  params,
}: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const printable = getLivePrintable(slug);
  if (!printable) notFound();

  return (
    <ResourceLayout
      resource={printable}
      sampleMode={printable.hasSample ? "inline" : "none"}
    >
      <PrintableSheet sheet={printable.sheet} />
    </ResourceLayout>
  );
}
