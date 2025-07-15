/** @type {import('next').NextConfig} */
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