import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Prisma Client imports
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Ensure Prisma Client resolves correctly
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '.prisma/client/default': require.resolve('.prisma/client/default'),
      };
    }
    return config;
  },
  async redirects() {
    return [
      // Explicit mappings provided
      { source: '/family', destination: '/services/refurbishments-upgrades', permanent: true },
      { source: '/tradein', destination: '/services/refurbishments-upgrades', permanent: true },
      { source: '/cabinet-archive', destination: '/verify', permanent: true },
      { source: '/lowther-family-the-speaker-database', destination: '/verify', permanent: true },
      { source: '/lowther-family-the-speaker-database/:path*', destination: '/verify', permanent: true },
      { source: '/reviews', destination: '/products', permanent: true },

      // Common legacy paths from old sitemap → current structure
      { source: '/phase-plugs', destination: '/ensemble/phase-plugs', permanent: true },
      { source: '/lowther-listening-room', destination: '/services/listening-rooms', permanent: true },
      { source: '/lowther-acousta-quarter-wave', destination: '/loudspeakers/acousta-quarter-wave', permanent: true },
      { source: '/lowther-voigt-horn-reproduction', destination: '/loudspeakers/voigt-horn', permanent: true },
      { source: '/handcrafted', destination: '/brand/handcrafted', permanent: true },
      { source: '/paul-voigt', destination: '/brand/paul-voigt-era', permanent: true },
      { source: '/lasting-legacy', destination: '/brand/lasting-legacy', permanent: true },
      { source: '/donald-chave', destination: '/brand/donald-chave-era', permanent: true },
      { source: '/lowther-oem', destination: '/services/oem-opportunities', permanent: true },

      // Collections
      { source: '/grand-opera-collection', destination: '/collection/grand-opera', permanent: true },
      { source: '/philharmonic-collection', destination: '/collection/philharmonic', permanent: true },
      // Typo in old sitemap "sinfona-collection"
      { source: '/sinfona-collection', destination: '/collection/sinfonia', permanent: true },
      { source: '/concert-collection', destination: '/collection/concert', permanent: true },

      // Ensemble
      { source: '/px4-amp', destination: '/ensemble/px4-amplifier', permanent: true },
      { source: '/cables', destination: '/ensemble/reference-cables', permanent: true },

      // Category landing
      { source: '/speakers', destination: '/products#instruments', permanent: true },
      { source: '/category/loudspeakers', destination: '/products#masterpieces', permanent: true },
      
      // Listen page redirect
      { source: '/listen', destination: '/services/listening-rooms', permanent: true },
      
      // Build a Lowther redirects
      { source: '/build-a-loudspeaker/build-a-lowther', destination: '/build-a-lowther', permanent: true },

      // Blog legacy categories and posts -> blog home
      { source: '/blog-categories/:path*', destination: '/blog', permanent: true },
      { source: '/blog-posts/:path*', destination: '/blog', permanent: true },

      // Generic legacy authentication/account routes -> homepage
      { source: '/log-in', destination: '/', permanent: true },
      { source: '/sign-up', destination: '/', permanent: true },
      { source: '/reset-password', destination: '/', permanent: true },
      { source: '/access-denied', destination: '/', permanent: true },
      { source: '/update-password', destination: '/', permanent: true },
      { source: '/user-account', destination: '/', permanent: true },

      // Promotions/editions and unknown legacy paths -> homepage
      { source: '/promotions/:path*', destination: '/', permanent: true },
      { source: '/editions', destination: '/', permanent: true },

      // Additional legacy product paths from old site
      { source: '/lowther-acousta-quarter-wave-2', destination: '/loudspeakers/acousta-quarter-wave', permanent: true },
      { source: '/lowther-205f-gb', destination: '/products', permanent: true },
      { source: '/205f', destination: '/products', permanent: true },
      { source: '/dx-series', destination: '/products#instruments', permanent: true },
      { source: '/lowther-ex-series', destination: '/collection/concert', permanent: true },
      { source: '/pm-series', destination: '/collection/concert', permanent: true },
      { source: '/lowther-editions', destination: '/products', permanent: true },
      { source: '/lowther-dx2', destination: '/products#instruments', permanent: true },
      { source: '/try', destination: '/book-appointment', permanent: true },
      { source: '/shop', destination: '/products', permanent: true },

      // Legacy /product/* paths
      { source: '/product/lowther-audiovector', destination: '/loudspeakers/audiovector', permanent: true },
      { source: '/product/almira', destination: '/loudspeakers/almira', permanent: true },
      { source: '/product/lowther-tp2', destination: '/products', permanent: true },
      { source: '/product/the-lowther-acousta-90-plan', destination: '/build-a-lowther', permanent: true },
      { source: '/product/the-lowther-acousta-116-plan', destination: '/build-a-lowther', permanent: true },
      { source: '/product/the-lowther-accolade-4-plan', destination: '/build-a-lowther', permanent: true },
      { source: '/product/the-academy', destination: '/products', permanent: true },

      // Legacy /products/* paths (series)
      { source: '/products/c-series', destination: '/products#instruments', permanent: true },
      { source: '/products/a-series', destination: '/products#instruments', permanent: true },
      { source: '/products/ex-series', destination: '/collection/concert', permanent: true },
      { source: '/products/dx-series', destination: '/products#instruments', permanent: true },

      // Legacy /product/* paths (individual products)
      { source: '/product/standard-dome', destination: '/ensemble/phase-plugs', permanent: true },
      { source: '/product/sound-diffuser', destination: '/ensemble/phase-plugs', permanent: true },
      { source: '/product/phase-equalizer', destination: '/ensemble/phase-plugs', permanent: true },
      { source: '/product/pm7a', destination: '/collection/concert', permanent: true },
      { source: '/product/pm6c', destination: '/collection/concert', permanent: true },
      { source: '/product/pm5a', destination: '/collection/concert', permanent: true },
      { source: '/product/pm4a', destination: '/collection/concert', permanent: true },
      { source: '/product/pm3a', destination: '/collection/concert', permanent: true },
      { source: '/product/pm2a', destination: '/collection/concert', permanent: true },
      { source: '/product/ex4', destination: '/collection/concert', permanent: true },
      { source: '/product/ex3', destination: '/collection/concert', permanent: true },
      { source: '/product/ex2', destination: '/collection/concert', permanent: true },
      { source: '/product/dx4', destination: '/products#instruments', permanent: true },
      { source: '/product/lowther-dx3', destination: '/products#instruments', permanent: true },
      { source: '/product/dx2', destination: '/products#instruments', permanent: true },
    ];
  },
};

export default nextConfig;
