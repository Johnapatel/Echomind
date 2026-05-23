/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    remotePatterns: []
  }
}

module.exports = nextConfig
