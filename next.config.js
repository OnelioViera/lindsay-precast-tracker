/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 's3.amazonaws.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig

