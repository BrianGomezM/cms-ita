import { getCurrentTenant, getAllPages } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mapa del sitio',
}

export default async function MapaSitioPage() {
  const tenant = await getCurrentTenant()
  const paginas = await getAllPages()

  // Enlaces de navegación principal (incluye submenús), tal como los ve el usuario
  const enlacesMenu = (tenant?.menuPrincipal ?? []).flatMap((item) => [
    { etiqueta: item.etiqueta, enlace: item.enlace },
    ...(item.submenu ?? []).map((sub) => ({ etiqueta: sub.etiqueta, enlace: sub.enlace })),
  ])

  const enlacesLegales = tenant?.footer?.enlacesLegales?.length
    ? tenant.footer.enlacesLegales
    : [
        { etiqueta: 'Política de privacidad', enlace: '/politicas' },
        { etiqueta: 'Términos de uso', enlace: '/terminos' },
      ]

  // Páginas publicadas que no aparecen en el menú principal ni en enlaces legales
  const enlacesConocidos = new Set([
    '/',
    ...enlacesMenu.map((e) => e.enlace),
    ...enlacesLegales.map((e) => e.enlace),
  ])
  const otrasPaginas = paginas.filter(
    (p: { slug: string }) => !enlacesConocidos.has(`/${p.slug}`)
  )

  return (
    <>
      <Header tenant={tenant ?? undefined} />
      <main className="flex-1">
        <section className="py-16">
          <div className="container-institucional max-w-3xl">
            <h1 className="section-title">Mapa del sitio</h1>
            <p className="text-gray-600 mb-10">
              Encuentra rápidamente las secciones y páginas disponibles en este portal.
            </p>

            <h2 className="text-lg font-bold text-primary mb-4">Navegación principal</h2>
            <ul className="grid sm:grid-cols-2 gap-2 mb-10">
              <li>
                <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors py-1">
                  <FileText size={14} className="text-secondary shrink-0" /> Inicio
                </Link>
              </li>
              {enlacesMenu.map((item) => (
                <li key={item.enlace}>
                  <Link href={item.enlace} className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors py-1">
                    <FileText size={14} className="text-secondary shrink-0" /> {item.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>

            {otrasPaginas.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-primary mb-4">Otras páginas</h2>
                <ul className="grid sm:grid-cols-2 gap-2 mb-10">
                  {otrasPaginas.map((p: { id: number; slug: string; titulo: string }) => (
                    <li key={p.id}>
                      <Link href={`/${p.slug}`} className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors py-1">
                        <FileText size={14} className="text-secondary shrink-0" /> {p.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="text-lg font-bold text-primary mb-4">Información legal</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {enlacesLegales.map((item) => (
                <li key={item.enlace}>
                  <Link href={item.enlace} className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors py-1">
                    <FileText size={14} className="text-secondary shrink-0" /> {item.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer tenant={tenant ?? undefined} />
    </>
  )
}
