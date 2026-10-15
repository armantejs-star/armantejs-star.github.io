import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // This is required for static GitHub Pages exports
  },
};

export default nextConfig;