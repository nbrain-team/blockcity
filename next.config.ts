import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ensure Next.js uses PORT from environment
  env: {
    PORT: process.env.PORT || '3000',
  },
};

export default nextConfig;
