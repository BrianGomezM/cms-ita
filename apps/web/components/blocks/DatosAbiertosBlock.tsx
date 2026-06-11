import { Download, ExternalLink, Calendar, Database } from 'lucide-react'
import type { DatosAbiertosBlockType } from '@/lib/types'

const FORMATO_LABELS: Record<string, string> = {
  csv: 'CSV',
  xlsx: 'Excel',
  json: 'JSON',
  xml: 'XML',
  pdf: 'PDF',
}

export default function DatosAbiertosBlock({ titulo, descripcion, items }: DatosAbiertosBlockType) {
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

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                <Database size={20} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-primary">
                    {FORMATO_LABELS[item.formato]}
                  </span>
                  {item.fechaActualizacion && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={13} />
                      Actualizado: {new Date(item.fechaActualizacion).toLocaleDateString('es-CO')}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">{item.nombre}</h3>
                {item.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed">{item.descripcion}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                {item.enlaceCatalogo && (
                  <a
                    href={item.enlaceCatalogo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ver catálogo <ExternalLink size={14} />
                  </a>
                )}
                <a
                  href={item.enlaceDescarga}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  Descargar <Download size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
