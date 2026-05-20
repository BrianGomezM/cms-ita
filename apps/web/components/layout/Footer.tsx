import Image from 'next/image'
import type { Tenant } from '@/lib/types'

export default function Footer({ tenant }: { tenant?: Tenant }) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna 1 — Entidad */}
        <div>
          <h3 className="text-white font-bold mb-3">
            {tenant?.nombre ?? 'Portal Institucional'}
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Entidad pública comprometida con la transparencia y el servicio al ciudadano.
          </p>
        </div>

        {/* Columna 2 — Contacto */}
        <div>
          <h3 className="text-white font-bold mb-3">Contacto</h3>
          <ul className="text-sm space-y-2 text-gray-400">
            <li>📞 Línea de atención: 018000 xxx xxx</li>
            <li>✉️ notificaciones@entidad.gov.co</li>
            <li>📍 Dirección, Municipio, Departamento</li>
            <li>🚨 Línea anticorrupción: 195</li>
          </ul>
        </div>

        {/* Columna 3 — Enlaces */}
        <div>
          <h3 className="text-white font-bold mb-3">Enlaces</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/politicas" className="text-gray-400 hover:text-white">Políticas de privacidad</a></li>
            <li><a href="/mapa-sitio" className="text-gray-400 hover:text-white">Mapa del sitio</a></li>
            <li><a href="https://www.gov.co" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">GOV.CO</a></li>
          </ul>
        </div>
      </div>

      {/* Barra inferior GOV.CO */}
      <div className="border-t border-gray-700 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} {tenant?.nombre}. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <Image src="https://www.gov.co/logo-govco.svg" alt="GOV.CO" width={64} height={24} className="h-6 w-auto opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  )
}