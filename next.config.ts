import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.beehiiv.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.beehiiv.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'beehiiv-images-production.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
