import type { Metadata } from "next";
import { Fraunces, Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart-provider";
import { MetaPixelHead } from "@/components/meta-pixel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteJsonLd } from "@/components/site-json-ld";
import { OG_IMAGE } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Personal Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: site.url,
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} guides` }],
    },
  },
  openGraph: {
    title: site.shareTitle,
    description: site.shareDescription,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: site.shareTitle,
    description: site.shareDescription,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/brand/club-logo.png",
    apple: "/brand/club-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${oswald.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <MetaPixelHead />
      </head>
      <body className="min-h-full flex flex-col text-ink">
        <SiteJsonLd />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
