import { site } from "@/lib/site";

export { default, generateStaticParams } from "./opengraph-image";

export const alt = `${site.name} guide`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;
