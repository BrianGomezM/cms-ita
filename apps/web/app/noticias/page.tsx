import { getCurrentTenant, getNoticias } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Megaphone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Noticias y avisos',
}

const ETIQUETAS_CATEGORIA: Record<string, string> = {
  noticia: 'Noticia',
  aviso: 'Aviso',
  comunicado: 'Comunicado',
  evento: 'Evento',
}

export default async function NoticiasPage() {
  const tenant = await getCurrentTenant()
  const noticias = await getNoticias(50)

  return (
    <>
      <Header tenant={tenant ?? undefined} />
      <main className="flex-1">
        <section className="py-16">
          <div className="container-institucional">
            <h1 className="section-title">Noticias y avisos</h1>
            <p className="text-gray-600 mb-12 max-w-2xl">
              Mantente informado sobre las novedades, avisos y comunicados de la entidad.
            </p>

            {noticias.length === 0 ? (
              <p className="text-gray-400">Aún no hay noticias publicadas.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {noticias.map((noticia: {
                  id: number
                  slug: string
                  titulo: string
                  resumen: string
                  imagen?: { url: string; alt: string }
                  categoria: string
                  fechaPublicacion: string
                }) => (
                  <Link
                    key={noticia.id}
                    href={`/noticias/${noticia.slug}`}
                    className="card group p-0 overflow-hidden flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden bg-blue-50 flex items-center justify-center">
                      {noticia.imagen?.url ? (
                        <Image
                          src={noticia.imagen.url}
                          alt={noticia.imagen.alt ?? noticia.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Megaphone className="text-primary" size={32} />
                      )}
                      <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded">
                        {ETIQUETAS_CATEGORIA[noticia.categoria] ?? noticia.categoria}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <CalendarDays size={12} />
                        {new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <h2 className="font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                        {noticia.titulo}
                      </h2>
                      <p className="text-sm text-gray-600 mt-2 flex-1 line-clamp-3">{noticia.resumen}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer tenant={tenant ?? undefined} />
    </>
  )
}
