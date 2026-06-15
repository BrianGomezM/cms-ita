import type { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/lib/payload'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getSiteBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/buscar'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
