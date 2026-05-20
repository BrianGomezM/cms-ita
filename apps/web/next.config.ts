import type { NextConfig } from 'next'
import { securityHeaders } from '../cms/src/middleware/securityHeaders'

const nextConfig: NextConfig = {
  turbopack: {
    root: '../../',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
    ],
  },
}

export default nextConfig