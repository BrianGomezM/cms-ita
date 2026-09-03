import { getCurrentTenant, searchPages } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FileText, ArrowRight, Search, SearchX } from 'lucide-react'
import type { Metadata } from 'next'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Resultados para "${q}"` : 'Buscar',
  }
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const tenant = await getCurrentTenant()
  const resultados = q ? await searchPages(q) : []

  return (
    <>
      <Header tenant={tenant ?? undefined} />
      <main className="flex-1">
        <section className="py-16">
          <div className="container-institucional max-w-3xl">
            <h1 className="section-title">
              {q ? `Resultados para "${q}"` : 'Buscar en el sitio'}
            </h1>

            {q && (
              <p className="text-gray-600 mt-2 mb-8">
                {resultados.length > 0
                  ? `${resultados.length} resultado${resultados.length === 1 ? '' : 's'} encontrado${resultados.length === 1 ? '' : 's'}`
                  : 'Sin resultados'}
              </p>
            )}

            {!q && (
              <div className="flex flex-col items-center text-center py-16 text-gray-400">
                <Search size={48} className="mb-4" />
                <p>Usa el buscador de la parte superior para encontrar páginas del sitio.</p>
              </div>
            )}

            {q && resultados.length === 0 && (
              <div className="flex flex-col items-center text-center py-16 text-gray-400">
                <SearchX size={48} className="mb-4" />
                <p>No encontramos páginas que coincidan con tu búsqueda.</p>
                <p className="text-sm mt-1">Intenta con otras palabras clave.</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {resultados.map((pagina: { id: number; slug: string; titulo: string; descripcion?: string }) => (
                <Link
                  key={pagina.id}
                  href={`/${pagina.slug}`}
                  className="card p-5 flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-primary group-hover:text-secondary transition-colors">
                      {pagina.titulo}
                    </h2>
                    {pagina.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{pagina.descripcion}</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all mt-2" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer tenant={tenant ?? undefined} />
    </>
  )
}
