import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",

        hostname: "your-supabase-project-id.supabase.co",
      },
    ],
  },
};

export default nextConfig;
