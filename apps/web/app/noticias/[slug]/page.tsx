import { getCurrentTenant, getNoticiaBySlug } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { extraerTextoLexical } from '@/lib/lexical'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

const ETIQUETAS_CATEGORIA: Record<string, string> = {
  noticia: 'Noticia',
  aviso: 'Aviso',
  comunicado: 'Comunicado',
  evento: 'Evento',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getNoticiaBySlug(slug)
  if (!noticia) return { title: 'Noticia no encontrada' }
  return {
    title: noticia.titulo,
    description: noticia.resumen,
  }
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params
  const tenant = await getCurrentTenant()
  const noticia = await getNoticiaBySlug(slug)

  if (!noticia) notFound()

  const contenido = extraerTextoLexical(noticia.contenido)

  return (
    <>
      <Header tenant={tenant ?? undefined} />
      <main className="flex-1">
        <article className="py-16">
          <div className="container-institucional max-w-3xl">
            <Link href="/noticias" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-6">
              <ArrowLeft size={14} /> Volver a noticias
            </Link>

            <span className="inline-block bg-secondary text-white text-xs font-semibold px-2 py-1 rounded mb-4">
              {ETIQUETAS_CATEGORIA[noticia.categoria] ?? noticia.categoria}
            </span>

            <h1 className="text-3xl font-bold text-primary leading-tight mb-2">{noticia.titulo}</h1>

            <span className="flex items-center gap-1 text-sm text-gray-400 mb-8">
              <CalendarDays size={14} />
              {new Date(noticia.fechaPublicacion).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>

            {noticia.imagen?.url && (
              <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={noticia.imagen.url}
                  alt={noticia.imagen.alt ?? noticia.titulo}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg prose-blue max-w-none whitespace-pre-line">
              {contenido || noticia.resumen}
            </div>
          </div>
        </article>
      </main>
      <Footer tenant={tenant ?? undefined} />
    </>
  )
}
