/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // appDir: true // Removed as it's now default in Next.js 14+
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'lib': path.resolve(__dirname, 'src/lib')
    };
    return config;
  }
};

module.exports = nextConfig;