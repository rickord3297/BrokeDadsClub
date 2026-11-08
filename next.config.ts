import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images-api.printify.com",
      },
      {
        protocol: "https",
        hostname: "images.printify.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.brokedadsclub.com" }],
        destination: "https://brokedadsclub.com/:path*",
        permanent: true,
      },
      { source: "/shop/club-patch", destination: "/shop", permanent: false },
      { source: "/shop/candy-stripe-patch", destination: "/shop", permanent: false },
      {
        source: "/guides/youth-sports-all-in-cost-checklist",
        destination: "/guides/the-sports-signup-fee-you-didnt-budget-for",
        permanent: true,
      },
      {
        source: "/guides/dad-tax-examples-the-small-asks-that-stack",
        destination: "/guides/the-dad-tax",
        permanent: true,
      },
      {
        source: "/guides/trunk-dinner-kit-beat-gas-station-panic",
        destination: "/guides/gas-station-dinner",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
