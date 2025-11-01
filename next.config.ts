import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
