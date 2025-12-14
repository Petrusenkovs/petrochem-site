import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'n8n6179.hostkey.in', 
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;