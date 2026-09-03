import Link from 'next/link'
import { Home, Search, ShieldCheck } from 'lucide-react'
import { getCurrentTenant } from '@/lib/payload'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

export default async function NotFound() {
  const tenant = (await getCurrentTenant()) ?? undefined

  return (
    <>
      <Header tenant={tenant} />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <div className="text-[160px] font-black text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Search size={32} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-primary mb-3">
            Página no encontrada
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            La página que buscas no existe, fue movida, o todavía no ha sido creada en el panel administrativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              <Home size={18} />
              Ir al inicio
            </Link>
            <a href={`${CMS_URL}/admin`} className="btn-outline">
              <ShieldCheck size={18} />
              Ir al panel admin
            </a>
          </div>
        </div>
      </main>

      <Footer tenant={tenant} />
    </>
  )
}
