/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Removed deprecated appDir option since it's now default in Next.js 14
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // Temporarily ignore type errors during development
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig;