import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceLayout } from "@/components/resource-layout";
import { getResourceSheet, dynamicResourceSlugs } from "@/components/resource-sheets/registry";
import { getResource } from "@/lib/resources";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return dynamicResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: { absolute: `${resource.seoTitle} | Broke Dads Club` },
    description: resource.description,
    keywords: resource.keywords,
    alternates: {
      canonical: `${site.url}/resources/${resource.slug}`,
    },
  };
}

export default async function ResourceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResource(slug);
  const Sheet = getResourceSheet(slug);
  if (!resource || !Sheet) notFound();

  return (
    <ResourceLayout resource={resource}>
      <Sheet />
    </ResourceLayout>
  );
}
