import type { NextConfig } from 'next'
import path from 'path'
import { securityHeaders, previewFrameHeaders } from '../cms/src/middleware/securityHeaders'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/preview/:path*',
        headers: previewFrameHeaders,
      },
    ]
  },
  images: {
    // En dev: sin optimización para evitar el bloqueo SSRF de Next.js con localhost
    // En prod: optimización normal (el CMS estará en un dominio real, no localhost)
    unoptimized: isDev,
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',                       port: '4000' },
      { protocol: 'http',  hostname: 'localhost',                       port: '9000' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com'             },
    ],
  },
}

export default nextConfig
