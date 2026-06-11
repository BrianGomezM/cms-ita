import { Monitor, MapPin, Shuffle, Clock, ArrowRight } from 'lucide-react'
import type { Tramite, TramiteBlockType } from '@/lib/types'

const TIPO_ICONOS: Record<Tramite['tipo'], typeof Monitor> = {
  virtual: Monitor,
  presencial: MapPin,
  mixto: Shuffle,
}

const TIPO_LABELS: Record<Tramite['tipo'], string> = {
  virtual: 'En línea',
  presencial: 'Presencial',
  mixto: 'Presencial y en línea',
}

export default function TramiteBlock({ titulo, descripcion, items }: TramiteBlockType) {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="container-institucional">

        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && (
              <>
                <h2 className="section-title">{titulo}</h2>
                <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
              </>
            )}
            {descripcion && <p className="text-gray-600 mt-4">{descripcion}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icono = TIPO_ICONOS[item.tipo]
            return (
              <div key={item.id} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                    <Icono size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{TIPO_LABELS[item.tipo]}</span>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2">{item.nombre}</h3>

                {item.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{item.descripcion}</p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  {item.tiempoRespuesta && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {item.tiempoRespuesta}
                    </span>
                  )}
                  {item.costo && (
                    <span className="font-semibold text-secondary">{item.costo}</span>
                  )}
                </div>

                {item.enlace && (
                  <a
                    href={item.enlace}
                    className="mt-auto inline-flex items-center gap-2 text-secondary font-medium text-sm hover:text-primary transition-colors group"
                  >
                    Iniciar trámite
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
