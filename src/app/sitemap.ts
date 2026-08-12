import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = getGuides();
  const products = await getProducts();

  return [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/guides`, lastModified: new Date() },
    { url: `${site.url}/shop`, lastModified: new Date() },
    { url: `${site.url}/about`, lastModified: new Date() },
    ...guides.map((guide) => ({
      url: `${site.url}/guides/${guide.slug}`,
      lastModified: new Date(guide.publishedAt),
    })),
    ...products.map((product) => ({
      url: `${site.url}/shop/${product.slug}`,
      lastModified: new Date(),
    })),
  ];
}
