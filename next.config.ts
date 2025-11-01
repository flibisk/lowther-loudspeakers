import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.beehiiv.com',
      },
      {
        protocol: 'https',
        hostname: 'beehiiv-images-production.s3.amazonaws.com',
      },
    ],
    domains: ['media.beehiiv.com', 'beehiiv-images-production.s3.amazonaws.com'],
  },
};

export default nextConfig;
