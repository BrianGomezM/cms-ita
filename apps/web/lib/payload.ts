// Cliente para consumir la API REST de Payload CMS
import { headers } from 'next/headers'
import type { Tenant, ITAResumen } from './types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const isDev = process.env.NODE_ENV === 'development'

// Tenant por defecto cuando no hay contexto de petición (build time) o el host
// no está mapeado a ningún tenant (debe coincidir con DEFAULT_TENANT_SLUG en middleware.ts)
const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG || 'camara-comercio-cauca'

// Busca un tenant por su slug o por su dominio propio
export async function getTenantByHost(host: string): Promise<Tenant | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/tenants?where[or][0][slug][equals]=${encodeURIComponent(host)}&where[or][1][dominio][equals]=${encodeURIComponent(host)}&depth=1`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}

// Obtiene un tenant por su slug
export async function getTenantBySlug(slug: string) {
  return getTenantByHost(slug)
}

// Resuelve el tenant de la petición actual a partir del header
// "x-tenant-host" inyectado por middleware.ts. Si no hay contexto de
// petición (ej: generateStaticParams en build) usa el tenant por defecto.
export async function getCurrentTenant(): Promise<Tenant | null> {
  let tenantHost = DEFAULT_TENANT_SLUG
  try {
    const headersList = await headers()
    tenantHost = headersList.get('x-tenant-host') || DEFAULT_TENANT_SLUG
  } catch {
    // headers() no disponible fuera de una petición (build time)
  }
  return getTenantByHost(tenantHost)
}

// Obtiene una página por su slug (solo publicadas), filtrando por el tenant actual
export async function getPageBySlug(slug: string) {
  const tenant = await getCurrentTenant()
  if (!tenant) return null

  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[slug][equals]=${slug}&where[estado][equals]=publicado&where[tenant][equals]=${tenant.id}&depth=2`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}

// Resumen público del Índice de Transparencia (% de cumplimiento) de un tenant
export async function getITAResumen(tenantId: number): Promise<ITAResumen | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/ita-checklist/resumen?tenant=${tenantId}`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Obtiene todas las páginas publicadas del tenant actual (para generar rutas estáticas)
export async function getAllPages() {
  const tenant = await getCurrentTenant()
  if (!tenant) return []

  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[estado][equals]=publicado&where[tenant][equals]=${tenant.id}&limit=100&depth=0`,
      isDev ? { cache: 'no-store' } : { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}
