import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack stays scoped to this workspace even if other lockfiles exist higher up
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'hemophiliaskh.ir',
          },
        ],
        destination: 'https://hemophiliaskh.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.hemophiliaskh.ir',
          },
        ],
        destination: 'https://hemophiliaskh.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
