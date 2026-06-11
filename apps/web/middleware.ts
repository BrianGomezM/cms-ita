import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tenant que se sirve cuando el dominio no coincide con ningún patrón conocido
// (desarrollo local, previews, etc.)
const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG || 'camara-comercio-cauca'

// Dominio base para subdominios por tenant: <slug>.cms.co
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'cms.co'

// Resuelve qué tenant debe servirse según el host de la petición
// y lo inyecta en el header "x-tenant-host" para que lo lean
// las funciones de apps/web/lib/payload.ts
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase()

  let tenantHost = host

  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    // Desarrollo local → tenant por defecto
    tenantHost = DEFAULT_TENANT_SLUG
  } else if (host.endsWith(`.${BASE_DOMAIN}`)) {
    // alcaldia-x.cms.co → slug "alcaldia-x"
    tenantHost = host.slice(0, -(BASE_DOMAIN.length + 1))
  }
  // En cualquier otro caso, el host es un dominio propio del tenant
  // (ej: www.cccauca.org.co) y se busca tal cual por el campo "dominio"

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-host', tenantHost)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
