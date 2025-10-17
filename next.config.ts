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
      {
        protocol: "https",
        hostname: "i.imgur.com", // imgur source
      },
      {
        protocol: "https",
        hostname: "biymlkhzjdwablqvkcma.supabase.co", // stored in the Supabase source
      },
    ],
  },
};

export default nextConfig;
