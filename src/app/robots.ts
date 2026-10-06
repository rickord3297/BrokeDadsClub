import type { MetadataRoute } from "next";

const PRODUCTION_URL = "https://brokedadsclub.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api/",
        "/cart",
        "/checkout",
        "/success",
        "/preview/",
        "/unsubscribe",
      ],
    },
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
    host: PRODUCTION_URL,
  };
}
