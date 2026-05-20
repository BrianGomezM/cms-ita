import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: '../../',
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
    ],
  },
}

export default nextConfig