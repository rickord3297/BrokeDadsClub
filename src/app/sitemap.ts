import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/guides", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.9 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = getGuides();
  const products = await getProducts();

  return [
    ...STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...resources.map((resource) => ({
      url: `${site.url}/resources/${resource.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...guides.map((guide) => ({
      url: `${site.url}/guides/${guide.slug}`,
      lastModified: new Date(guide.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${site.url}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
