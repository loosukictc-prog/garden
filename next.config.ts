import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/garden",
  assetPrefix: "/garden/",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: true,
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
