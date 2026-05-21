// Cliente para consumir la API REST de Payload CMS
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const isDev = process.env.NODE_ENV === 'development'

// Obtiene una página por su slug (solo publicadas)
export async function getPageBySlug(slug: string) {
  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[slug][equals]=${slug}&where[estado][equals]=publicado&depth=2`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}

// Obtiene todas las páginas publicadas (para generar rutas estáticas)
export async function getAllPages() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[estado][equals]=publicado&limit=100&depth=0`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}

// Obtiene un tenant por su slug
export async function getTenantBySlug(slug: string) {
  try {
    const res = await fetch(
      `${CMS_URL}/api/tenants?where[slug][equals]=${slug}&depth=1`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}
