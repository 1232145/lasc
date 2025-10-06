import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // gallery
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // sponsor logos
      },
      {
        protocol: "https",
        hostname: "logos-world.net", // if others appear later
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com", // generic source
      },
    ],
  },
};

export default nextConfig;
