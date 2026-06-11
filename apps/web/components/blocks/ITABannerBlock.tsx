import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import type { ITABannerBlockType } from '@/lib/types'
import { getCurrentTenant, getITAResumen } from '@/lib/payload'

export default async function ITABannerBlock({ titulo, descripcion, enlace }: ITABannerBlockType) {
  const tenant = await getCurrentTenant()
  const resumen = tenant ? await getITAResumen(tenant.id) : null

  if (!resumen) return null

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container-institucional flex flex-col md:flex-row items-center gap-8">

        <div className="relative shrink-0 w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="16" fill="none" stroke="#e8a020" strokeWidth="3"
              strokeDasharray={`${resumen.porcentaje} 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{resumen.porcentaje}%</span>
            <span className="text-xs text-blue-200">cumplimiento</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <ShieldCheck size={20} className="text-[#e8a020]" />
            <h2 className="text-xl font-bold">{titulo}</h2>
          </div>
          {descripcion && (
            <p className="text-blue-100 text-sm max-w-2xl">{descripcion}</p>
          )}
          <p className="text-blue-200 text-xs mt-2">
            {resumen.cumple} de {resumen.aplicables} ítems aplicables cumplidos
          </p>
        </div>

        {enlace && (
          <Link
            href={enlace}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver más <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  )
}
