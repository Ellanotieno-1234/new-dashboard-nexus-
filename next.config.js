/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // For API routes
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig