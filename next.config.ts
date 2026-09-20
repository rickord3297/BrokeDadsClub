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
    ];
  },
};

export default nextConfig;
