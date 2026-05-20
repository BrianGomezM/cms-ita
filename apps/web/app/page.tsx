import { getPageBySlug } from '@/lib/payload'
import BlockRenderer from '@/components/BlockRenderer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function HomePage() {
  const page = await getPageBySlug('inicio')

  return (
    <>
      <Header tenant={page?.tenant} />
      <main className="flex-1">
        {page ? (
          <BlockRenderer blocks={page.layout} />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Portal en construcción
              </h1>
              <p className="text-gray-500">
                Configura las páginas desde el panel administrativo.
              </p>

              <a
                href="http://localhost:3000/admin"
                className="mt-6 inline-block bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
              >
                Ir al panel admin →
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer tenant={page?.tenant} />
    </>
  )
}