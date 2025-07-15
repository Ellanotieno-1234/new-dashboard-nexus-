/** @type {import('next').NextConfig} */
<<<<<<< HEAD
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  // Increase timeout for API routes
  serverRuntimeConfig: {
    maxDuration: 300, // 5 minutes
  },
}

module.exports = nextConfig
=======
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
>>>>>>> f468ec3abcf0bca0ee6b2c17c3e2ba8bfbb8698d
