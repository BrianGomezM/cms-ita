import type { MetadataRoute } from 'next'
import { getCurrentTenant, getAllPages, getNoticias, getSiteBaseUrl } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteBaseUrl()
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }]
  }

  const paginas = await getAllPages()
  const noticias = await getNoticias(100)

  const entradas: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/mapa-sitio`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  for (const pagina of paginas as Array<{ slug: string; updatedAt?: string }>) {
    if (pagina.slug === 'inicio') continue
    entradas.push({
      url: `${baseUrl}/${pagina.slug}`,
      lastModified: pagina.updatedAt ? new Date(pagina.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  if (noticias.length > 0) {
    entradas.push({ url: `${baseUrl}/noticias`, changeFrequency: 'daily', priority: 0.8 })
  }

  for (const noticia of noticias as Array<{ slug: string; fechaPublicacion?: string }>) {
    entradas.push({
      url: `${baseUrl}/noticias/${noticia.slug}`,
      lastModified: noticia.fechaPublicacion ? new Date(noticia.fechaPublicacion) : undefined,
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  return entradas
}
