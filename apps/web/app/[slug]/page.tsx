import { getPageBySlug, getAllPages } from '@/lib/payload'
import BlockRenderer from '@/components/BlockRenderer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

// Genera rutas estáticas para todas las páginas publicadas
export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page: { slug: string }) => ({ slug: page.slug }))
}

// Metadata dinámica por página
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return { title: 'Página no encontrada' }
  return {
    title: `${page.titulo} — ${page.tenant?.nombre ?? 'Portal'}`,
    description: page.descripcion ?? '',
    openGraph: {
      images: page.imagenSeo?.url ? [page.imagenSeo.url] : [],
    },
  }
}

export default async function PageRoute({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return (
    <>
      <Header tenant={page.tenant} />
      <main className="flex-1">
        <BlockRenderer blocks={page.layout} tenant={page.tenant} />
      </main>
      <Footer tenant={page.tenant} />
    </>
  )
}