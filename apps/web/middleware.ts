import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dominio base para subdominios por tenant: <slug>.cms.co
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'cms.co'

// Resuelve qué tenant debe servirse según el host de la petición
// y lo inyecta en el header "x-tenant-host" para que lo lean
// las funciones de apps/web/lib/payload.ts
//
// El host "pelado" (localhost, 127.0.0.1, o el dominio raíz en producción)
// deliberadamente NO cae a ningún tenant por defecto — no matchea ningún
// slug/dominio real, así que getTenantByHost() devuelve null y el sitio
// muestra la pantalla de portal/selector en vez del contenido de un tenant.
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase()

  let tenantHost = host

  if (host.endsWith('.localhost')) {
    // tenant2.localhost:3001 → slug "tenant2" (los navegadores resuelven
    // *.localhost a 127.0.0.1 automáticamente, sin tocar el archivo hosts)
    tenantHost = host.slice(0, -'.localhost'.length)
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
