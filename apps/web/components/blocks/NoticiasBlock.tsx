import type { NoticiasBlockType } from '@/lib/types'
import { getNoticias } from '@/lib/payload'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Megaphone } from 'lucide-react'

const ETIQUETAS_CATEGORIA: Record<string, string> = {
  noticia: 'Noticia',
  aviso: 'Aviso',
  comunicado: 'Comunicado',
  evento: 'Evento',
}

export default async function NoticiasBlock({ titulo, descripcion, cantidad, soloDestacadas }: NoticiasBlockType) {
  const noticias = await getNoticias(Number(cantidad), soloDestacadas)

  if (!noticias.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-institucional">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            {titulo && <h2 className="section-title mb-0">{titulo}</h2>}
            {descripcion && <p className="text-gray-600 mt-2 max-w-2xl">{descripcion}</p>}
          </div>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-secondary font-medium text-sm hover:text-primary transition-colors shrink-0"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

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
                <h3 className="font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                  {noticia.titulo}
                </h3>
                <p className="text-sm text-gray-600 mt-2 flex-1 line-clamp-3">{noticia.resumen}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
