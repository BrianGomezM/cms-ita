import { ExternalLink, Calendar, Banknote } from 'lucide-react'
import type { ContrataBlockType } from '@/lib/types'

const ESTADO_ESTILOS: Record<string, string> = {
  abierto: 'bg-green-100 text-green-700',
  evaluacion: 'bg-yellow-100 text-yellow-700',
  adjudicado: 'bg-blue-100 text-blue-700',
  cerrado: 'bg-gray-100 text-gray-600',
}

const ESTADO_LABELS: Record<string, string> = {
  abierto: 'Abierto',
  evaluacion: 'En evaluación',
  adjudicado: 'Adjudicado',
  cerrado: 'Cerrado',
}

const MODALIDAD_LABELS: Record<string, string> = {
  licitacion: 'Licitación pública',
  directa: 'Contratación directa',
  'minima-cuantia': 'Mínima cuantía',
  'seleccion-abreviada': 'Selección abreviada',
  'concurso-meritos': 'Concurso de méritos',
}

export default function ContrataBlock({ titulo, descripcion, items }: ContrataBlockType) {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-gray-50">
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

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ESTADO_ESTILOS[item.estado]}`}>
                    {ESTADO_LABELS[item.estado]}
                  </span>
                  {item.modalidad && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-primary">
                      {MODALIDAD_LABELS[item.modalidad]}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.nombre}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {item.fechaPublicacion && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(item.fechaPublicacion).toLocaleDateString('es-CO')}
                    </span>
                  )}
                  {item.valor && (
                    <span className="flex items-center gap-1">
                      <Banknote size={14} />
                      {item.valor}
                    </span>
                  )}
                </div>
              </div>

              {item.enlaceSecop && (
                <a
                  href={item.enlaceSecop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  Ver en SECOP <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
