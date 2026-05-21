import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra GOV.CO */}
      <div className="bg-[#3366cc] text-white text-xs py-1.5 px-4">
        <div className="container-institucional">
          <a href="https://www.gov.co" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline w-fit">
            🇨🇴 Un sitio web oficial del Estado colombiano
          </a>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <div className="text-[160px] font-black text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#003366] rounded-2xl flex items-center justify-center shadow-lg">
                <Search size={32} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#003366] mb-3">
            Página no encontrada
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              <Home size={18} />
              Ir al inicio
            </Link>
            <Link href="/" className="btn-outline">
              <ArrowLeft size={18} />
              Volver al inicio
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">¿Buscabas alguno de estos?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: 'Registro Mercantil', href: '/registro-mercantil' },
                { label: 'Certificados', href: '/certificados' },
                { label: 'Contratación', href: '/contratacion' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#003366] hover:text-[#003366] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="container-institucional text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Cámara de Comercio del Cauca. Todos los derechos reservados.
        </div>
      </div>
    </div>
  )
}