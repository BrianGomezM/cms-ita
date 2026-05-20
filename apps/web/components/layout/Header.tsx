import type { Tenant } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function Header({ tenant }: { tenant?: Tenant }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Barra GOV.CO — requerida por Resolución 1519 */}
      <div className="bg-[#3366CC] text-white text-xs py-1 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span>🇨🇴</span>
          <a
            href="https://www.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Un sitio web oficial del Estado colombiano — Aquí le explicamos cómo identificarlo
          </a>
        </div>
      </div>

      {/* Header principal */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {tenant?.logo?.url && (
            <Image
              src={tenant.logo.url}
              alt={tenant.nombre}
              width={120}
              height={48}
              className="object-contain h-12 w-auto"
            />
          )}
          <span className="font-bold text-gray-800 text-lg">
            {tenant?.nombre ?? 'Portal Institucional'}
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-700">Inicio</Link>
          <Link href="/nosotros" className="hover:text-blue-700">Nosotros</Link>
          <Link href="/servicios" className="hover:text-blue-700">Servicios</Link>
          <Link href="/contratacion" className="hover:text-blue-700">Contratación</Link>
          <Link href="/contacto" className="hover:text-blue-700">Contacto</Link>
        </nav>
      </div>
    </header>
  )
}