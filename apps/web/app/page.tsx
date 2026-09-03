import { getPageBySlug, getCurrentTenant, getTenantsActivos } from '@/lib/payload'
import BlockRenderer from '@/components/BlockRenderer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { headers } from 'next/headers'
import type { Tenant } from '@/lib/types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const isDev = process.env.NODE_ENV === 'development'

// Construye la URL propia del tenant a partir del host actual (funciona
// igual en local — <slug>.localhost:3001 — que en producción — <slug>.cms.co
// o el dominio propio del tenant si lo tiene configurado).
async function urlDelTenant(tenant: Tenant): Promise<string> {
  if (tenant.dominio) return `https://${tenant.dominio}`
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3001'
  const proto = headersList.get('x-forwarded-proto') || (isDev ? 'http' : 'https')
  return `${proto}://${tenant.slug}.${host}`
}

export default async function HomePage() {
  const page = await getPageBySlug('inicio')

  if (page) {
    return (
      <>
        <Header tenant={page.tenant} />
        <main className="flex-1">
          <BlockRenderer blocks={page.layout} />
        </main>
        <Footer tenant={page.tenant} />
      </>
    )
  }

  // No hay página de inicio para el tenant resuelto por el host actual —
  // ¿es porque el host SÍ apunta a un tenant real (falta configurarlo), o
  // porque el host no apunta a ningún tenant (ej: localhost pelado)?
  const tenant = await getCurrentTenant()

  if (tenant) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Portal en construcción
          </h1>
          <p className="text-gray-500">
            Configura las páginas desde el panel administrativo.
          </p>

          <a
            href={`${CMS_URL}/admin`}
            className="mt-6 inline-block bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Ir al panel admin →
          </a>
        </div>
      </div>
    )
  }

  // El host no coincide con ningún tenant (ej: localhost:3001 sin subdominio,
  // o el dominio raíz de la plataforma) — mostrar selector si hay tenants
  // activos, o un mensaje limpio si todavía no hay ninguno.
  const tenants = await getTenantsActivos()

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Portal en construcción
        </h1>

        {tenants.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {await Promise.all(
              tenants.map(async (t) => (
                <a
                  key={t.id}
                  href={await urlDelTenant(t)}
                  className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 min-w-64"
                >
                  {t.nombre}
                </a>
              )),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
